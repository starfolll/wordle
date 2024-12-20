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

# Route53 variables
variable "domain" {
  description = "Domain name"
  type        = string
}

variable "record_name" {
  description = "The name of the website including subdomain"
  type        = string
}

variable "module_load_balancer_dns_name" {
  description = "DNS name of the load balancer"
  type        = string
}

variable "module_load_balancer_zone_id" {
  description = "Zone ID of the load balancer"
  type        = string
}
