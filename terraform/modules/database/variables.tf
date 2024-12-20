# General variables
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
variable "internal_access_security_group" {
  description = "Security group ID for internal access"
  type        = set(string)
}

# Database variables
variable "db_allocated_storage" {
  description = "Database allocated storage"
  type        = number
}

variable "db_name" {
  description = "Database name"
  type        = string
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
