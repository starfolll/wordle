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

# Load balancer variables
variable "balancing_module_name" {
  description = "Name of the service to balance"
  type        = string
}

variable "balancing_module_port" {
  description = "Port of the service to balance"
  type        = number
}

variable "balancing_module_target_ids" {
  description = "List of target IDs to balance"
  type        = set(string)
}

variable "balancing_module_security_group" {
  description = "Security group ID for the load balancer"
  type        = set(string)
}
