<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Cors;

class CorsFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $config = new Cors();
        
        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            $origin = $_SERVER['HTTP_ORIGIN'];
            if (in_array($origin, $config->allowedOrigins)) {
                header("Access-Control-Allow-Origin: $origin");
            }
        }
        
        // Allow specific methods
        header('Access-Control-Allow-Methods: ' . implode(', ', $config->allowedMethods));
        
        // Allow specific headers
        header('Access-Control-Allow-Headers: ' . implode(', ', $config->allowedHeaders));
        
        // Handle preflight requests
        if ($request->getMethod() === 'options') {
            return service('response')->setStatusCode(200);
        }
        
        return $request;
    }
    
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $response;
    }
}