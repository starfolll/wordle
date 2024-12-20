resource "aws_security_group" "instance_database_internal_access" {
  name = "${var.app_name}-${var.app_environment_name}-database-internal-access"

  ingress {
    description = "Allow PostgreSQL access from Bastion Host"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    security_groups = var.internal_access_security_group
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "instance_database" {
  allocated_storage = var.db_allocated_storage

  vpc_security_group_ids = [
    aws_security_group.instance_database_internal_access.id
  ]

  storage_type   = "standard"
  instance_class = "db.t3.micro"

  engine = "postgres"

  db_name     = var.db_name
  username = var.db_username
  password = var.db_password

  publicly_accessible = false

  backup_retention_period = 1
  skip_final_snapshot     = true

  tags = {
    Name = "${var.app_name}-${var.app_environment_name}-instance-db"
  }
}
