resource "aws_key_pair" "ec2_key_pair" {
  key_name   = var.key_pair_name
  public_key = tls_private_key.rsa.public_key_openssh
}

resource "tls_private_key" "rsa" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_file" "ec2_key_pair" {
  content         = tls_private_key.rsa.private_key_pem
  filename        = var.key_pair_file_path
  file_permission = "400"
}
