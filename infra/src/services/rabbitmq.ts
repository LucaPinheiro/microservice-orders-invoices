import * as awsx from "@pulumi/awsx";
import { cluster } from "../cluster";
import { appLoadBalancer } from "../load-balancer";

// Para quais instâncias o Load Balancer vai enviar as requisições
const rabbitMQAdminTargetGroup = appLoadBalancer.createTargetGroup(
  "rabbitmq-admin-tg",
  {
    port: 15672,
    protocol: "HTTP",
    healthCheck: {
      path: "/",
      protocol: "HTTP",
    },
  }
);

// Para qual porta o Load Balancer vai enviar as requisições
export const rabbitMQAdminHttpListener = appLoadBalancer.createListener(
  "rabbitmq-admin-listener",
  {
    // Essa porta é a porta que o Load Balancer vai escutar
    port: 15672,
    protocol: "HTTP",
    targetGroup: rabbitMQAdminTargetGroup,
  }
);

export const rabbitMQService = new awsx.classic.ecs.FargateService(
  "fargate-rabbitmq",
  {
    cluster,
    desiredCount: 1,
    waitForSteadyState: false,
    taskDefinitionArgs: {
      container: {
        image: "rabbitmq:3-management",
        cpu: 256,
        memory: 512,
        environment: [
          { name: "RABBITMQ_DEFAULT_USER", value: "admin" },
          { name: "RABBITMQ_DEFAULT_PASS", value: "admin" },
        ],
      },
    },
  }
);
