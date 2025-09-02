<?php
namespace App\Models;

use CodeIgniter\Model;

class TeacherModel extends Model
{
    protected $table = 'teachers';
    protected $primaryKey = 'id';
    protected $allowedFields = ['user_id', 'university_name', 'gender', 'year_joined', 'department'];
    
    public function getTeacherWithUser($userId = null)
    {
        $builder = $this->db->table('teachers');
        $builder->select('teachers.*, auth_user.email, auth_user.first_name, auth_user.last_name');
        $builder->join('auth_user', 'auth_user.id = teachers.user_id');
        
        if ($userId) {
            $builder->where('teachers.user_id', $userId);
            return $builder->get()->getRowArray();
        }
        
        return $builder->get()->getResultArray();
    }
}