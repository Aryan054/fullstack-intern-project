<?php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\TeacherModel;

class TeacherController extends ResourceController
{
    use ResponseTrait;
    
    // Middleware to verify JWT token
    protected function verifyToken()
    {
        $key = getenv('JWT_SECRET');
        $header = $this->request->getHeaderLine('Authorization');
        $token = null;
        
        // Extract the token
        if (!empty($header)) {
            if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
                $token = $matches[1];
            }
        }
        
        if (!$token) {
            return $this->failUnauthorized('Token required');
        }
        
        try {
            $decoded = JWT::decode($token, $key, ['HS256']);
            return $decoded;
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid token');
        }
    }
    
    public function index()
    {
        // Verify token
        $decoded = $this->verifyToken();
        if ($decoded instanceof \CodeIgniter\HTTP\Response) {
            return $decoded;
        }
        
        $teacherModel = new TeacherModel();
        $teachers = $teacherModel->getTeacherWithUser();
        
        return $this->respond([
            'status' => 200,
            'data' => $teachers
        ]);
    }
    
  public function show($id = null)
  {
    // Verify token
    $decoded = $this->verifyToken();
    if ($decoded instanceof \CodeIgniter\HTTP\Response) {
        return $decoded;
    }
    
    $teacherModel = new TeacherModel();
    $teacher = $teacherModel->getTeacherWithUser($id);
    
    if (!$teacher) {
        return $this->failNotFound('Teacher not found');
    }
    
    return $this->respond([
        'status' => 200,
        'data' => $teacher
    ]);
  }
}