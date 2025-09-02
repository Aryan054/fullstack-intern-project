<?php
namespace App\Models;

use CodeIgniter\Model;
use Firebase\JWT\JWT;

class UserModel extends Model
{
    protected $table = 'auth_user';
    protected $primaryKey = 'id';
    protected $allowedFields = ['email', 'first_name', 'last_name', 'password'];
    protected $beforeInsert = ['hashPassword'];
    protected $beforeUpdate = ['hashPassword'];
    
    protected function hashPassword(array $data)
    {
        if (isset($data['data']['password'])) {
            $data['data']['password'] = password_hash($data['data']['password'], PASSWORD_DEFAULT);
        }
        return $data;
    }
    
    public function validateUser($email, $password)
    {
        $user = $this->where('email', $email)->first();
        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }
        return false;
    }
    
    public function generateJWT($user)
    {
        $key = getenv('JWT_SECRET');
        $payload = [
            'iat' => time(),
            'exp' => time() + (60 * 60), // 1 hour expiration
            'uid' => $user['id'],
            'email' => $user['email']
        ];
        
        return JWT::encode($payload, $key, 'HS256');
    }
}