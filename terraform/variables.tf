# Main variables
variable "app_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Name of the web application"
  type        = string
  default     = "wordle-plus"
}

variable "app_environment_name" {
  description = "Deployment environment (dev/stage/prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = can(regex("^(dev|stage|prod)$", var.app_environment_name))
    error_message = "Environment name must be dev, stage, or prod"
  }
}

# VPC variables
variable "allowed_direct_access_connection_ip" {
  description = "IP address to allow direct connection to infra"
  type        = string
}

# EC2 general variables
variable "key_pair_name" {
  description = "Name of the key pair"
  type        = string
  default     = "wordle-plus-key"
}

variable "key_pair_file_path" {
  description = "Instance type"
  type        = string
  default     = "./secrets/wordle-plus-key.pem"
}

variable "ansible_playbook_path" {
  description = "Path to the ansible playbook"
  type        = string
  default     = "./ansible"
}

# EC2 backend variables
variable "backend_ami_id" {
  description = "Amazon Machine Image ID for ec2"
  type        = string
  default     = "ami-0e2c8caa4b6378d8c"
}

# RDS variables
variable "db_allocated_storage" {
  description = "Database allocated storage"
  type        = number
  default     = 10
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}
