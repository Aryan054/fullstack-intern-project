<?php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\UserModel;
use App\Models\TeacherModel;

class AuthController extends ResourceController
{
    use ResponseTrait;
    
    public function register()
    {
        $userModel = new UserModel();
        $teacherModel = new TeacherModel();
        
        // Get JSON data from request
        $data = $this->request->getJSON(true);
        
        // Validate user data
        if (!isset($data['email']) || !isset($data['password']) || 
            !isset($data['first_name']) || !isset($data['last_name'])) {
            return $this->failValidationErrors('Missing required fields');
        }
        
        // Check if user already exists
        if ($userModel->where('email', $data['email'])->first()) {
            return $this->failResourceExists('User already exists');
        }
        
        // Start transaction
        $this->db->transStart();
        
        try {
            // Create user
            $userData = [
                'email' => $data['email'],
                'password' => $data['password'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name']
            ];
            
            $userId = $userModel->insert($userData);
            
            // Create teacher profile
            $teacherData = [
                'user_id' => $userId,
                'university_name' => $data['university_name'] ?? '',
                'gender' => $data['gender'] ?? 'other',
                'year_joined' => $data['year_joined'] ?? date('Y'),
                'department' => $data['department'] ?? ''
            ];
            
            $teacherModel->insert($teacherData);
            
            $this->db->transComplete();
            
            // Generate JWT token
            $user = $userModel->find($userId);
            $token = $userModel->generateJWT($user);
            
            return $this->respondCreated([
                'status' => 201,
                'message' => 'User registered successfully',
                'token' => $token
            ]);
            
        } catch (\Exception $e) {
            $this->db->transRollback();
            return $this->failServerError('Registration failed: ' . $e->getMessage());
        }
    }
    
    public function login()
    {
        $userModel = new UserModel();
        
        $data = $this->request->getJSON(true);
        
        if (!isset($data['email']) || !isset($data['password'])) {
            return $this->failValidationErrors('Email and password are required');
        }
        
        $user = $userModel->validateUser($data['email'], $data['password']);
        
        if (!$user) {
            return $this->failUnauthorized('Invalid email or password');
        }
        
        $token = $userModel->generateJWT($user);
        
        return $this->respond([
            'status' => 200,
            'message' => 'Login successful',
            'token' => $token
        ]);
    }
}