<?php
class EmailHelper {
    
    public static function sendVerificationEmail($email, $name, $token) {
        $subject = "AgriWatch - Email Verification";
        $verificationLink = "http://localhost/agriwatch/verify-email.html?token=" . $token;
        
        $message = "
        <html>
        <head>
            <title>Email Verification</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #667eea;'>🌱 AgriWatch - Email Verification</h2>
                <p>Hello <strong>$name</strong>,</p>
                <p>Thank you for creating your AgriWatch account! Please verify your email address by clicking the button below:</p>
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='$verificationLink' style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;'>Verify Email Address</a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style='background: #f8f9fa; padding: 10px; border-radius: 5px; word-break: break-all;'>$verificationLink</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't create this account, please ignore this email.</p>
                <hr style='margin: 30px 0; border: none; border-top: 1px solid #e1e8ed;'>
                <p style='color: #7f8c8d; font-size: 12px;'>This is an automated email from AgriWatch. Please do not reply to this email.</p>
            </div>
        </body>
        </html>
        ";
        
        return self::sendEmail($email, $subject, $message);
    }
    
    public static function sendPasswordResetEmail($email, $name, $token) {
        $subject = "AgriWatch - Password Reset";
        $resetLink = "http://localhost/agriwatch/reset-password.html?token=" . $token;
        
        $message = "
        <html>
        <head>
            <title>Password Reset</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #667eea;'>🌱 AgriWatch - Password Reset</h2>
                <p>Hello <strong>$name</strong>,</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='$resetLink' style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;'>Reset Password</a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style='background: #f8f9fa; padding: 10px; border-radius: 5px; word-break: break-all;'>$resetLink</p>
                <p>This link will expire in 1 hour.</p>
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
        // For development mode, we'll simulate email sending
        // In production, you would use a real email service
        
        // Log the email for development purposes
        $logFile = __DIR__ . '/../../email_log.txt';
        $logEntry = date('Y-m-d H:i:s') . " - To: $to, Subject: $subject\n";
        $logEntry .= "Message: $message\n";
        $logEntry .= str_repeat('-', 80) . "\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND);
        
        // In development mode, always return true to simulate successful sending
        // In production, you would use: return mail($to, $subject, $message, $headers);
        return true;
    }
    
    public static function generateToken() {
        return bin2hex(random_bytes(32));
    }
}
?>
