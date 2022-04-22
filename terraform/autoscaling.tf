resource "aws_appautoscaling_target" "ecs_scaling_target" {
  service_namespace  = "ecs"
  resource_id        = "service/${aws_ecs_cluster.ecs_cluster.name}/${aws_ecs_service.ecs_fargate_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  role_arn           = aws_iam_role.ecs_autoscale_role.arn
  min_capacity       = 1
  max_capacity       = 3
}

resource "aws_appautoscaling_policy" "ecs_scale_out_policy" {
  name               = "${var.project}-scale-out"
  policy_type        = "StepScaling"
  service_namespace  = aws_appautoscaling_target.ecs_scaling_target.service_namespace
  resource_id        = aws_appautoscaling_target.ecs_scaling_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_scaling_target.scalable_dimension

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      metric_interval_lower_bound = 0
      scaling_adjustment          = 1
    }
  }
}

resource "aws_appautoscaling_policy" "ecs_scale_in_policy" {
  name               = "${var.project}-scale-in"
  policy_type        = "StepScaling"
  service_namespace  = aws_appautoscaling_target.ecs_scaling_target.service_namespace
  resource_id        = aws_appautoscaling_target.ecs_scaling_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_scaling_target.scalable_dimension

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      metric_interval_upper_bound = 0
      scaling_adjustment          = -1
    }
  }
}

resource "aws_cloudwatch_metric_alarm" "ecsfargate_cpu_high" {
  alarm_name          = "${var.project}-cpu-utilization-high"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "75"

  dimensions = {
    ClusterName = aws_ecs_cluster.ecs_cluster.name
    ServiceName = aws_ecs_service.ecs_fargate_service.name
  }

  alarm_actions = [
    aws_appautoscaling_policy.ecs_scale_out_policy.arn
  ]
}

resource "aws_cloudwatch_metric_alarm" "ecsfargate_cpu_low" {
  alarm_name          = "${var.project}-cpu-utilization-low"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "35"

  dimensions = {
    ClusterName = aws_ecs_cluster.ecs_cluster.name
    ServiceName = aws_ecs_service.ecs_fargate_service.name
  }

  alarm_actions = [
    aws_appautoscaling_policy.ecs_scale_in_policy.arn
  ]
}

#IAM
resource "aws_iam_role" "ecs_autoscale_role" {
  name               = "${var.project}-ecs-autoscale-role"
  assume_role_policy = data.aws_iam_policy_document.assume_autoScaling_role.json
}

resource "aws_iam_policy_attachment" "ecs_autoscale_role_attach" {
  name       = "${var.project}-ecs-autoscale-role-attach"
  roles      = ["${aws_iam_role.ecs_autoscale_role.name}"]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceAutoscaleRole"
}