import * as awsx  from "@pulumi/awsx";
import { cluster } from "./cluster";

// Security Group -> Qual serviço exengar qual serviço
// Load Balancer -> Qual serviço expor para o mundo (HTTP, HTTPS, etc.)


export const appLoadBalancer = new awsx.classic.lb.ApplicationLoadBalancer('app-lb', {
  securityGroups: cluster.securityGroups,
})

export const networkLoadBalancder = new awsx.classic.lb.NetworkLoadBalancer('net-lb', {
  subnets: cluster.vpc.publicSubnetIds,
})