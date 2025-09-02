<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Cors extends BaseConfig
{
    public $allowedOrigins = ['http://localhost:3000']; // React app URL
    public $allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
    public $allowedHeaders = ['Content-Type', 'Authorization'];
    public $exposedHeaders = [];
    public $maxAge = 0;
    public $supportsCredentials = false;
}