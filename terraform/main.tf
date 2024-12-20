terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.app_region
}

module "backend" {
  source = "./modules/backend"

  app_name             = var.app_name
  app_region           = var.app_region
  app_environment_name = var.app_environment_name

  key_pair_name      = var.key_pair_name
  key_pair_file_path = var.key_pair_file_path

  allowed_direct_access_connection_ip = var.allowed_direct_access_connection_ip
  ami_id                              = var.backend_ami_id

  ansible_playbook_path                  = var.ansible_playbook_path
  module_load_balancer_security_group_id = module.load_balancer_backend.load_balancer_security_group_id
}
module "load_balancer_backend" {
  source = "./modules/load-balancer"

  app_name             = var.app_name
  app_region           = var.app_region
  app_environment_name = var.app_environment_name

  balancing_module_name = "backend"
  balancing_module_port = 3000

  balancing_module_security_group = [module.backend.security_group.id]
  balancing_module_target_ids     = [module.backend.instance.id]
}

module "database" {
  source = "./modules/database"

  app_name             = var.app_name
  app_region           = var.app_region
  app_environment_name = var.app_environment_name

  db_allocated_storage = 10

  db_name     = var.db_name
  db_username = var.db_username
  db_password = var.db_password

  internal_access_security_group = [
    module.backend.security_group.id
  ]
}
