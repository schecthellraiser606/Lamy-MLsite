#vpc
resource "aws_vpc" "vpc" {
  cidr_block                       = "192.168.0.0/20"
  instance_tenancy                 = "default"
  enable_dns_support               = true
  enable_dns_hostnames             = true
  assign_generated_ipv6_cidr_block = false

  tags = {
    Name    = "${var.project}-vpc"
    Project = var.project
  }
}

#subnet
resource "aws_subnet" "public_subnet_1a_app" {
  vpc_id                  = aws_vpc.vpc.id
  availability_zone       = "ap-northeast-1a"
  cidr_block              = "192.168.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name    = "${var.project}-public-subnet-1a-app"
    Project = var.project
    Type    = "public"
  }
}

resource "aws_subnet" "public_subnet_1c_app" {
  vpc_id                  = aws_vpc.vpc.id
  availability_zone       = "ap-northeast-1c"
  cidr_block              = "192.168.2.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name    = "${var.project}-public-subnet-1c-app"
    Project = var.project
    Type    = "public"
  }
}

resource "aws_subnet" "private_subnet_1a_db" {
  vpc_id                  = aws_vpc.vpc.id
  availability_zone       = "ap-northeast-1a"
  cidr_block              = "192.168.3.0/24"
  map_public_ip_on_launch = false

  tags = {
    Name    = "${var.project}-private-subnet-1a-db"
    Project = var.project
    Type    = "private"
  }
}

resource "aws_subnet" "private_subnet_1c_db" {
  vpc_id                  = aws_vpc.vpc.id
  availability_zone       = "ap-northeast-1c"
  cidr_block              = "192.168.4.0/24"
  map_public_ip_on_launch = false

  tags = {
    Name    = "${var.project}-private-subnet-1c-db"
    Project = var.project
    Type    = "private"
  }
}

#route table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name    = "${var.project}-private-rt"
    Project = var.project
    Type    = "priavte"
  }
}

resource "aws_route_table_association" "public_rt_1a_app" {
  route_table_id = aws_route_table.public_rt.id
  subnet_id      = aws_subnet.public_subnet_1a_app.id
}

resource "aws_route_table_association" "public_rt_1c_app" {
  route_table_id = aws_route_table.public_rt.id
  subnet_id      = aws_subnet.public_subnet_1c_app.id
}

resource "aws_route_table_association" "private_rt_1a_db" {
  route_table_id = aws_route_table.public_rt.id
  subnet_id      = aws_subnet.private_subnet_1a_db.id
}

resource "aws_route_table_association" "private_rt_1c_db" {
  route_table_id = aws_route_table.public_rt.id
  subnet_id      = aws_subnet.private_subnet_1c_db.id
}

#gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name    = "${var.project}-igw"
    Project = var.project
  }
}

resource "aws_route" "private_rt_igw_r" {
  route_table_id         = aws_route_table.public_rt.id
  gateway_id             = aws_internet_gateway.igw.id
  destination_cidr_block = "0.0.0.0/0"
}