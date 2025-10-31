<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

// Add cache-busting headers
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get all users or specific user
        if(isset($_GET['id'])) {
            $id = $_GET['id'];
            $query = "SELECT id, name, email, role, is_email_verified, created_at FROM users WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $id);
            $stmt->execute();
            
            if($stmt->rowCount() > 0) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                // Convert is_email_verified to boolean - handle null/empty values
                $user['is_email_verified'] = !empty($user['is_email_verified']) && $user['is_email_verified'] != '0';
                http_response_code(200);
                echo json_encode($user);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "User not found."));
            }
        } else {
            // Get all users
            $query = "SELECT id, name, email, role, is_email_verified, created_at FROM users ORDER BY created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            $users = array();
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                // Debug: Log the raw value
                error_log("User {$row['email']}: raw is_email_verified = " . var_export($row['is_email_verified'], true));
                
                // Convert is_email_verified to boolean - handle null/empty values
                $row['is_email_verified'] = !empty($row['is_email_verified']) && $row['is_email_verified'] != '0';
                
                // Debug: Log the converted value
                error_log("User {$row['email']}: converted is_email_verified = " . var_export($row['is_email_verified'], true));
                
                $users[] = $row;
            }
            
            // Add timestamp to ensure fresh data
            $response = array(
                'users' => $users,
                'timestamp' => date('Y-m-d H:i:s'),
                'count' => count($users),
                'cache_buster' => time() . '_' . rand(1000, 9999)
            );
            
            http_response_code(200);
            echo json_encode($response);
        }
        break;
        
    case 'POST':
        // Create new user
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->name) && !empty($data->email) && !empty($data->password) && !empty($data->role)) {
            // Check if email already exists
            $check_query = "SELECT id FROM users WHERE email = :email";
            $check_stmt = $db->prepare($check_query);
            $check_stmt->bindParam(":email", $data->email);
            $check_stmt->execute();
            
            if($check_stmt->rowCount() > 0) {
                http_response_code(400);
                echo json_encode(array("message" => "Email already exists."));
                break;
            }
            
            // Hash password
            $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
            
            $query = "INSERT INTO users (name, email, password, role, is_email_verified) VALUES (:name, :email, :password, :role, 1)";
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":name", $data->name);
            $stmt->bindParam(":email", $data->email);
            $stmt->bindParam(":password", $hashed_password);
            $stmt->bindParam(":role", $data->role);
            
            if($stmt->execute()) {
                http_response_code(201);
                echo json_encode(array("message" => "User created successfully."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Unable to create user."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
        }
        break;
        
    case 'PUT':
        // Update user
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->id)) {
            // Check database connection
            if(!$db) {
                http_response_code(500);
                echo json_encode(array("message" => "Database connection failed."));
                break;
            }
            
            // Verify the user ID exists and is valid
            $id_check_query = "SELECT id FROM users WHERE id = :id";
            $id_check_stmt = $db->prepare($id_check_query);
            $id_check_stmt->bindParam(":id", $data->id);
            $id_check_stmt->execute();
            
            if($id_check_stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(array("message" => "User ID not found."));
                break;
            }
            
            // First, get the current user's data
            $current_user_query = "SELECT name, email, role FROM users WHERE id = :id";
            $current_user_stmt = $db->prepare($current_user_query);
            $current_user_stmt->bindParam(":id", $data->id);
            $current_user_stmt->execute();
            
            if($current_user_stmt->rowCount() > 0) {
                $current_user = $current_user_stmt->fetch(PDO::FETCH_ASSOC);
                
                // Use provided values or fall back to current values
                $name = !empty($data->name) ? $data->name : $current_user['name'];
                $email = !empty($data->email) ? $data->email : $current_user['email'];
                $role = !empty($data->role) ? $data->role : $current_user['role'];
                
                // Validate that we have valid values
                if(empty($name) || empty($email) || empty($role)) {
                    http_response_code(400);
                    echo json_encode(array("message" => "Name, email, and role cannot be empty."));
                    break;
                }
                
                // Validate email format
                if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    http_response_code(400);
                    echo json_encode(array("message" => "Invalid email format."));
                    break;
                }
                
                // Validate role
                if(!in_array($role, ['user', 'admin'])) {
                    http_response_code(400);
                    echo json_encode(array("message" => "Invalid role. Must be 'user' or 'admin'."));
                    break;
                }
                
                // Only check email uniqueness if the email is actually being changed
                if($email !== $current_user['email']) {
                    // Check if new email already exists for other users
                    $check_query = "SELECT id FROM users WHERE email = :email AND id != :id";
                    $check_stmt = $db->prepare($check_query);
                    $check_stmt->bindParam(":email", $email);
                    $check_stmt->bindParam(":id", $data->id);
                    $check_stmt->execute();
                    
                    if($check_stmt->rowCount() > 0) {
                        http_response_code(400);
                        echo json_encode(array("message" => "Email already exists."));
                        break;
                    }
                }
                
                // Log the update operation for debugging
                error_log("Updating user ID {$data->id}: name='{$name}', email='{$email}', role='{$role}'");
                
                $query = "UPDATE users SET name = :name, email = :email, role = :role WHERE id = :id";
                $stmt = $db->prepare($query);
                
                $stmt->bindParam(":name", $name);
                $stmt->bindParam(":email", $email);
                $stmt->bindParam(":role", $role);
                $stmt->bindParam(":id", $data->id);
                
                if($stmt->execute()) {
                    // Check if any rows were actually affected
                    $affected_rows = $stmt->rowCount();
                    error_log("Update affected {$affected_rows} rows for user ID {$data->id}");
                    
                    if($affected_rows === 0) {
                        http_response_code(500);
                        echo json_encode(array("message" => "No changes were made to the user."));
                        break;
                    }
                    
                    // Verify the update actually happened
                    $verify_query = "SELECT id, name, email, role, is_email_verified FROM users WHERE id = :id";
                    $verify_stmt = $db->prepare($verify_query);
                    $verify_stmt->bindParam(":id", $data->id);
                    $verify_stmt->execute();
                    
                    if($verify_stmt->rowCount() > 0) {
                        $updated_user = $verify_stmt->fetch(PDO::FETCH_ASSOC);
                        // Convert is_email_verified to boolean - handle null/empty values
                        $updated_user['is_email_verified'] = !empty($updated_user['is_email_verified']) && $updated_user['is_email_verified'] != '0';
                        error_log("User update verified: " . json_encode($updated_user));
                        http_response_code(200);
                        echo json_encode(array(
                            "message" => "User updated successfully.",
                            "updated_user" => $updated_user
                        ));
                    } else {
                        http_response_code(500);
                        echo json_encode(array("message" => "User update verification failed."));
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(array("message" => "Unable to update user."));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "User not found."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "User ID is required."));
        }
        break;
        
    case 'DELETE':
        // Delete user
        if(isset($_GET['id'])) {
            $id = $_GET['id'];
            
            // Don't allow deletion of admin users
            $check_query = "SELECT role FROM users WHERE id = :id";
            $check_stmt = $db->prepare($check_query);
            $check_stmt->bindParam(":id", $id);
            $check_stmt->execute();
            
            if($check_stmt->rowCount() > 0) {
                $user = $check_stmt->fetch(PDO::FETCH_ASSOC);
                if($user['role'] === 'admin') {
                    http_response_code(400);
                    echo json_encode(array("message" => "Cannot delete admin users."));
                    break;
                }
            }
            
            $query = "DELETE FROM users WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $id);
            
            if($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "User deleted successfully."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Unable to delete user."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "User ID is required."));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?>
