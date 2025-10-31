<?php
// Include PHPMailer using normalized base path (fix Windows path resolution)
$__EMAIL_BASE_DIR = dirname(__DIR__); // backend
require_once $__EMAIL_BASE_DIR . '/vendor/phpmailer/Exception.php';
require_once $__EMAIL_BASE_DIR . '/vendor/phpmailer/PHPMailer.php';
require_once $__EMAIL_BASE_DIR . '/vendor/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailHelper {
    
    // Gmail SMTP Configuration
    private static $smtp_host = 'smtp.gmail.com';
    private static $smtp_port = 587;
    private static $smtp_username = 'project05sd42@gmail.com'; // Your Gmail
    private static $smtp_password = 'wiqe bkla ghwd aaqd'; // Your app password
    private static $from_email = 'project05sd42@gmail.com'; // Your Gmail
    private static $from_name = 'AgriWatch';
    
    public static function sendVerificationEmail($email, $name, $verificationCode) {
        $subject = "AgriWatch - Email Verification Code";
        
        $message = "
        <html>
        <head>
            <title>Email Verification</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #667eea;'>🌱 AgriWatch - Email Verification</h2>
                <p>Hello <strong>$name</strong>,</p>
                <p>Thank you for creating your AgriWatch account! Please verify your email address using the verification code below:</p>
                
                <div style='text-align: center; margin: 30px 0;'>
                    <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; display: inline-block;'>
                        <h1 style='margin: 0; font-size: 2.5rem; letter-spacing: 8px;'>$verificationCode</h1>
                    </div>
                </div>
                
                <p><strong>Your verification code is: $verificationCode</strong></p>
                
                <p>Please enter this 4-digit code on the verification page to complete your account setup.</p>
                
                <p style='color: #e74c3c;'><strong>Important:</strong> This code will expire in 10 minutes for security reasons.</p>
                
                <p>If you didn't create this account, please ignore this email.</p>
                
                <hr style='margin: 30px 0; border: none; border-top: 1px solid #e1e8ed;'>
                <p style='color: #7f8c8d; font-size: 12px;'>This is an automated email from AgriWatch. Please do not reply to this email.</p>
            </div>
        </body>
        </html>
        ";
        
        return self::sendEmail($email, $subject, $message);
    }
    
    public static function sendPasswordResetEmail($email, $name, $resetCode) {
        $subject = "AgriWatch - Password Reset Code";
        
        $message = "
        <html>
        <head>
            <title>Password Reset</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #667eea;'>🌱 AgriWatch - Password Reset</h2>
                <p>Hello <strong>$name</strong>,</p>
                <p>We received a request to reset your password. Please use the verification code below:</p>
                
                <div style='text-align: center; margin: 30px 0;'>
                    <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; display: inline-block;'>
                        <h1 style='margin: 0; font-size: 2.5rem; letter-spacing: 8px;'>$resetCode</h1>
                    </div>
                </div>
                
                <p><strong>Your reset code is: $resetCode</strong></p>
                
                <p>Please enter this 4-digit code on the password reset page to create a new password.</p>
                
                <p style='color: #e74c3c;'><strong>Important:</strong> This code will expire in 10 minutes for security reasons.</p>
                
                <p>If you didn't request a password reset, please ignore this email.</p>
                
                <hr style='margin: 30px 0; border: none; border-top: 1px solid #e1e8ed;'>
                <p style='color: #7f8c8d; font-size: 12px;'>This is an automated email from AgriWatch. Please do not reply to this email.</p>
            </div>
        </body>
        </html>
        ";
        
        return self::sendEmail($email, $subject, $message);
    }
    
    private static function sendEmail($to, $subject, $message) {
        // Check if SMTP is configured
        if (self::$smtp_username === 'your-email@gmail.com' || self::$smtp_password === 'your-app-password') {
            // Fallback to logging for development
            return self::logEmailForDevelopment($to, $subject, $message);
        }
        
        // Try to send real email with PHPMailer
        $emailSent = self::sendRealEmail($to, $subject, $message);
        
        // Always log for debugging
        self::logEmailForDevelopment($to, $subject, $message, $emailSent);
        
        return $emailSent;
    }
    
    private static function sendRealEmail($to, $subject, $message) {
        try {
            // Create a new PHPMailer instance
            $mail = new PHPMailer(true);
            
            // Server settings
            $mail->isSMTP();
            $mail->Host = self::$smtp_host;
            $mail->SMTPAuth = true;
            $mail->Username = self::$smtp_username;
            $mail->Password = self::$smtp_password;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = self::$smtp_port;
            
            // Enable debug output (optional - remove in production)
            // $mail->SMTPDebug = SMTP::DEBUG_SERVER;
            
            // Recipients
            $mail->setFrom(self::$from_email, self::$from_name);
            $mail->addAddress($to);
            $mail->addReplyTo(self::$from_email, self::$from_name);
            
            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $message;
            $mail->AltBody = strip_tags($message);
            
            // Send email
            $mail->send();
            
            error_log("Email sent successfully to: $to");
            return true;
            
        } catch (Exception $e) {
            error_log("Email sending failed: " . $mail->ErrorInfo);
            return false;
        }
    }
    
    private static function logEmailForDevelopment($to, $subject, $message, $sent = false) {
        // Log the email for development purposes
        $logFile = __DIR__ . '/../../email_log.txt';
        $logEntry = date('Y-m-d H:i:s') . " - To: $to, Subject: $subject, Sent: " . ($sent ? 'YES' : 'NO') . "\n";
        $logEntry .= "Message: $message\n";
        $logEntry .= str_repeat('-', 80) . "\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND);
    }
    
    public static function generateVerificationCode() {
        // Generate a random 4-digit code
        return str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
    }
    
    public static function generateToken() {
        return bin2hex(random_bytes(32));
    }
    
    // Method to configure SMTP settings
    public static function configureSMTP($email, $password) {
        self::$smtp_username = $email;
        self::$smtp_password = $password;
        self::$from_email = $email;
        
        // Update the configuration file
        $configContent = file_get_contents(__FILE__);
        $configContent = str_replace(
            "private static \$smtp_username = 'your-email@gmail.com';",
            "private static \$smtp_username = '$email';"
        );
        $configContent = str_replace(
            "private static \$smtp_password = 'your-app-password';",
            "private static \$smtp_password = '$password';"
        );
        $configContent = str_replace(
            "private static \$from_email = 'your-email@gmail.com';",
            "private static \$from_email = '$email';"
        );
        
        file_put_contents(__FILE__, $configContent);
        
        return true;
    }
}
?>
