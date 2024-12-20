# Main variables
variable "app_region" {
  description = "AWS region"
  type        = string
}

variable "app_name" {
  description = "Name of the web application"
  type        = string
}

variable "app_environment_name" {
  description = "Deployment environment (dev/staging/production)"
  type        = string
}

# VPC variables
variable "allowed_direct_access_connection_ip" {
  description = "IP address to allow direct connection to infra"
  type        = string
}

# Instance variables
variable "ami_id" {
  description = "Amazon Machine Image ID for ec2"
  type        = string
}

variable "key_pair_name" {
  description = "Name of the key pair"
  type        = string
}

variable "key_pair_file_path" {
  description = "Name of the key pair file"
  type        = string
}

variable "ansible_playbook_path" {
  description = "Path to the ansible playbook"
  type        = string
}

variable "module_load_balancer_security_group_id" {
  description = "Security group ID for the load balancer"
  type        = string
}
