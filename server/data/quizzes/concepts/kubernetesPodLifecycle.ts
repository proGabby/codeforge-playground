import type { QuizQuestion } from '../../../../src/types';

export const KUBERNETES_LIFECYCLE_50_QUESTIONS: QuizQuestion[] = [
  // ============================================================================
  // EASY / FOUNDATIONAL (Questions 1 - 17)
  // ============================================================================
  {
    id: 'q-devops-k8s-1',
    difficulty: 'easy',
    question: 'In Kubernetes, which of the following is an official top-level Pod Phase reported in pod.status.phase?',
    options: [
      { id: 'a', text: 'CrashLoopBackOff' },
      { id: 'b', text: 'ContainerCreating' },
      { id: 'c', text: 'Running' },
      { id: 'd', text: 'Terminating' },
    ],
    correctOptionId: 'c',
    explanation: 'The official Pod phases in Kubernetes are Pending, Running, Succeeded, Failed, and Unknown. Values like CrashLoopBackOff and ContainerCreating are container Waiting states, while "Terminating" is a kubectl display abstraction when deletionTimestamp is set.',
    conceptTag: 'k8s-pod-phases',
  },
  {
    id: 'q-devops-k8s-2',
    difficulty: 'easy',
    question: 'A Kubernetes container fails repeatedly immediately upon startup. The kubelet places it in CrashLoopBackOff. What is the exponential backoff behavior of this state?',
    options: [
      { id: 'a', text: 'The kubelet retries restarts with exponential backoff delays (10s, 20s, 40s, 80s...) capped at a maximum of 5 minutes' },
      { id: 'b', text: 'The kubelet permanently shuts down the node hosting the pod' },
      { id: 'c', text: 'The kubelet immediately reschedules the pod to another node after 3 failed attempts' },
      { id: 'd', text: 'The kubelet retries at a fixed interval of 1 second indefinitely' },
    ],
    correctOptionId: 'a',
    explanation: 'CrashLoopBackOff indicates a container is repeatedly failing to start or crashing after start. The kubelet restarts it with an exponential backoff delay (10s, 20s, 40s, 80s, 160s, up to 300s/5min). If the container runs successfully for 10 minutes, the backoff timer resets.',
    conceptTag: 'k8s-crashloopbackoff-delay',
  },
  {
    id: 'q-devops-k8s-3',
    difficulty: 'easy',
    question: 'What is the specific responsibility of a Kubernetes livenessProbe?',
    options: [
      { id: 'a', text: 'It checks if the application is ready to accept incoming traffic from a Kubernetes Service' },
      { id: 'b', text: 'It provisions persistent storage volumes dynamically when disk space is full' },
      { id: 'c', text: 'It measures CPU usage to scale up pod replicas in the HorizontalPodAutoscaler' },
      { id: 'd', text: 'It determines if a container is still alive and functioning; if the probe fails, the kubelet kills the container and initiates its restart policy' },
    ],
    correctOptionId: 'd',
    explanation: 'A livenessProbe detects application deadlocks or unrecoverable internal failures. When a liveness probe fails (after failureThreshold attempts), the kubelet terminates the container process and restarts it according to the Pod restartPolicy.',
    conceptTag: 'k8s-liveness-probe',
  },
  {
    id: 'q-devops-k8s-4',
    difficulty: 'easy',
    question: 'How does a Kubernetes readinessProbe differ fundamentally from a livenessProbe?',
    options: [
      { id: 'a', text: 'readinessProbe restarts the node, while livenessProbe restarts the container' },
      { id: 'b', text: 'readinessProbe controls whether the Pod IP is added to or removed from matching Kubernetes Service endpoints, without restarting the container upon failure' },
      { id: 'c', text: 'readinessProbe is only supported for Golang containers' },
      { id: 'd', text: 'readinessProbe runs only once during cluster bootstrap' },
    ],
    correctOptionId: 'b',
    explanation: 'While a failed livenessProbe kills and restarts the container, a failed readinessProbe simply removes the Pod IP from the EndpointSlice / Endpoints of any matching Services. The container remains running, but receives no external service traffic until the readiness check passes.',
    conceptTag: 'k8s-readiness-vs-liveness',
  },
  {
    id: 'q-devops-k8s-5',
    difficulty: 'easy',
    question: 'A legacy enterprise Java application takes 90 seconds to warm up its JVM and load caches. Which probe prevents the livenessProbe from prematurely killing the application during startup?',
    codeSnippet: `spec:
  containers:
  - name: legacy-app
    image: enterprise/legacy:v1
    startupProbe:
      httpGet:
        path: /healthz
        port: 8080
      failureThreshold: 30
      periodSeconds: 10`,
    options: [
      { id: 'a', text: 'startupProbe' },
      { id: 'b', text: 'nodeAffinity probe' },
      { id: 'c', text: 'preStop hook' },
      { id: 'd', text: 'postStart hook' },
    ],
    correctOptionId: 'a',
    explanation: 'startupProbe disables liveness and readiness checks until the startup probe succeeds for the first time. In this example, it allows up to 30 * 10 = 300 seconds for warmup before liveness probes are ever evaluated.',
    conceptTag: 'k8s-startup-probe',
  },
  {
    id: 'q-devops-k8s-6',
    difficulty: 'easy',
    question: 'Which of the following is NOT a native probe mechanism supported in standard Kubernetes Pod specifications?',
    options: [
      { id: 'a', text: 'httpGet' },
      { id: 'b', text: 'tcpSocket' },
      { id: 'c', text: 'exec' },
      { id: 'd', text: 'snmpPoll' },
    ],
    correctOptionId: 'd',
    explanation: 'Kubernetes natively supports four probe handler types: httpGet (HTTP GET request), tcpSocket (TCP socket connection check), exec (executes a command inside the container and checks for exit code 0), and grpc (checks gRPC health checking protocol). snmpPoll is not supported.',
    conceptTag: 'k8s-probe-mechanisms',
  },
  {
    id: 'q-devops-k8s-7',
    difficulty: 'easy',
    question: 'What does the periodSeconds field define in a Kubernetes probe specification?',
    options: [
      { id: 'a', text: 'The maximum duration the probe is allowed to run before timing out' },
      { id: 'b', text: 'How frequently (in seconds) the kubelet performs the probe check' },
      { id: 'c', text: 'How long to wait before executing the very first probe after container launch' },
      { id: 'd', text: 'How many times the probe must succeed before the container is marked Ready' },
    ],
    correctOptionId: 'b',
    explanation: 'periodSeconds specifies the frequency (interval) in seconds with which the kubelet executes the health check. The default value is 10 seconds, and the minimum value is 1 second.',
    conceptTag: 'k8s-probe-period-seconds',
  },
  {
    id: 'q-devops-k8s-8',
    difficulty: 'easy',
    question: 'What does initialDelaySeconds configure in a probe definition?',
    options: [
      { id: 'a', text: 'The duration DNS records are cached by CoreDNS' },
      { id: 'b', text: 'The grace period before sending SIGKILL to an unready container' },
      { id: 'c', text: 'The time in seconds to wait after the container has started before the first probe is initiated' },
      { id: 'd', text: 'The interval between retrying a failed HTTP GET request' },
    ],
    correctOptionId: 'c',
    explanation: 'initialDelaySeconds tells the kubelet how many seconds to wait after the container transitions to Running before initiating the first probe check, giving the process time to initialize.',
    conceptTag: 'k8s-probe-initial-delay',
  },
  {
    id: 'q-devops-k8s-9',
    difficulty: 'easy',
    question: 'When inspecting a Pod with kubectl describe pod, what does the container state Waiting with reason ImagePullBackOff indicate?',
    options: [
      { id: 'a', text: 'The container exceeded its CPU limits during image decompression' },
      { id: 'b', text: 'The kubelet failed to pull the container image (due to invalid tag, non-existent repository, or missing imagePullSecrets) and is backing off before retrying' },
      { id: 'c', text: 'The image was pulled successfully but contained malware' },
      { id: 'd', text: 'The node disk is formatted in a filesystem incompatible with OCI' },
    ],
    correctOptionId: 'b',
    explanation: 'ImagePullBackOff occurs when the kubelet cannot pull the specified image (e.g. image name typo, wrong tag, private registry authentication missing). After an initial ErrImagePull failure, the kubelet enters an exponential backoff waiting period.',
    conceptTag: 'k8s-imagepullbackoff',
  },
  {
    id: 'q-devops-k8s-10',
    difficulty: 'easy',
    question: 'Under what conditions does a Kubernetes Pod transition to the Succeeded phase?',
    options: [
      { id: 'a', text: 'When all containers in the Pod have successfully terminated with exit code 0 and will not be restarted' },
      { id: 'b', text: 'When the Pod has been running without restarts for 30 consecutive days' },
      { id: 'c', text: 'When the HorizontalPodAutoscaler reaches its maximum replica limit' },
      { id: 'd', text: 'When all readiness probes return HTTP 200 OK for 10 minutes' },
    ],
    correctOptionId: 'a',
    explanation: 'A Pod enters the Succeeded phase when all containers in the Pod spec have terminated with exit code 0 and the restartPolicy prevents further restarts (typical for completed Kubernetes Jobs with restartPolicy: OnFailure or Never).',
    conceptTag: 'k8s-pod-phase-succeeded',
  },
  {
    id: 'q-devops-k8s-11',
    difficulty: 'easy',
    question: 'What are the three valid values for restartPolicy in a Kubernetes Pod specification?',
    options: [
      { id: 'a', text: 'Always, UnlessStopped, Never' },
      { id: 'b', text: 'Automatic, Manual, Disabled' },
      { id: 'c', text: 'Always, OnFailure, Never' },
      { id: 'd', text: 'Immediate, Linear, Exponential' },
    ],
    correctOptionId: 'c',
    explanation: 'The restartPolicy field in a PodSpec only accepts three values: Always (default for Deployments/DaemonSets), OnFailure (restarts only on non-zero exit code; common for Jobs), and Never.',
    conceptTag: 'k8s-pod-restart-policy',
  },
  {
    id: 'q-devops-k8s-12',
    difficulty: 'easy',
    question: 'If a container exits with Exit Code 137, what does this indicate regarding the Linux process lifecycle?',
    options: [
      { id: 'a', text: 'The process exited normally with return code 0' },
      { id: 'b', text: 'The process crashed due to an unhandled NullPointerException in application code' },
      { id: 'c', text: 'The process was terminated by SIGTERM (signal 15)' },
      { id: 'd', text: 'The process was terminated by signal 9 (SIGKILL), because 128 + 9 = 137, typically caused by the Linux OOM Killer or kubelet force-kill' },
    ],
    correctOptionId: 'd',
    explanation: 'In UNIX systems, when a process is killed by a signal, the exit code is 128 + signal_number. Signal 9 is SIGKILL, so 128 + 9 = 137. This is the hallmark of being killed by the Linux Out-Of-Memory (OOM) killer or by the kubelet after a timeout.',
    conceptTag: 'k8s-exit-code-137-sigkill',
  },
  {
    id: 'q-devops-k8s-13',
    difficulty: 'easy',
    question: 'What happens if a container has no livenessProbe defined in its Kubernetes spec?',
    options: [
      { id: 'a', text: 'The kubelet restarts the container every 60 minutes automatically' },
      { id: 'b', text: 'The kubelet defaults to querying port 80 over HTTP every 10 seconds' },
      { id: 'c', text: 'Kubernetes refuses to schedule the Pod on any worker node' },
      { id: 'd', text: 'The kubelet assumes the liveness state is permanently Success as long as the process is running in its PID namespace' },
    ],
    correctOptionId: 'd',
    explanation: 'If a container does not specify a livenessProbe, the kubelet considers the container healthy as long as the container primary process (PID 1) is running. It will only restart if the process terminates or crashes.',
    conceptTag: 'k8s-default-probe-behavior',
  },
  {
    id: 'q-devops-k8s-14',
    difficulty: 'easy',
    question: 'Which probe parameter determines how many consecutive probe failures must occur before the kubelet takes corrective action?',
    options: [
      { id: 'a', text: 'timeoutSeconds' },
      { id: 'b', text: 'successThreshold' },
      { id: 'c', text: 'failureThreshold' },
      { id: 'd', text: 'periodSeconds' },
    ],
    correctOptionId: 'c',
    explanation: 'failureThreshold defines the number of consecutive failed probe checks required before Kubernetes transitions the probe status to failed (default is 3). For a liveness probe, this triggers container restart; for readiness, it unpublishes endpoints.',
    conceptTag: 'k8s-probe-failure-threshold',
  },
  {
    id: 'q-devops-k8s-15',
    difficulty: 'easy',
    question: 'Why should a livenessProbe NOT make an outbound network call to verify database connectivity?',
    options: [
      { id: 'a', text: 'Kubernetes network policies strictly forbid health checks from initiating egress traffic' },
      { id: 'b', text: 'If the database experiences high load or a network blip, all dependent application pods will fail their liveness probes simultaneously and crash in a cascading restart storm' },
      { id: 'c', text: 'The kubelet runs on a different subnet that cannot reach database ports' },
      { id: 'd', text: 'Liveness probes only support ICMP ping packets' },
    ],
    correctOptionId: 'b',
    explanation: 'Liveness probes should only check local process health (e.g., event loop not blocked, internal threads alive). If a liveness probe checks external dependencies like databases, a transient DB outage causes the entire cluster of app pods to restart repeatedly, exacerbating the outage with massive reconnection storms.',
    conceptTag: 'k8s-probe-anti-patterns',
  },
  {
    id: 'q-devops-k8s-16',
    difficulty: 'easy',
    question: 'What is the default value of terminationGracePeriodSeconds for a Kubernetes Pod if left unspecified?',
    options: [
      { id: 'a', text: '30 seconds' },
      { id: 'b', text: '10 seconds' },
      { id: 'c', text: '5 seconds' },
      { id: 'd', text: '60 seconds' },
    ],
    correctOptionId: 'a',
    explanation: 'The default terminationGracePeriodSeconds is 30 seconds. This is the time Kubernetes gives the container to shut down cleanly after receiving SIGTERM before issuing a non-catchable SIGKILL.',
    conceptTag: 'k8s-termination-grace-period-default',
  },
  {
    id: 'q-devops-k8s-17',
    difficulty: 'easy',
    question: 'In a multi-container Pod, how do containers share network communication with one another?',
    options: [
      { id: 'a', text: 'Through public Internet DNS hostnames resolved by CoreDNS' },
      { id: 'b', text: 'Via an encrypted SSH tunnel mounted in /var/run/secrets' },
      { id: 'c', text: 'Over localhost (127.0.0.1) because all containers in the same Pod share the same Linux Network namespace' },
      { id: 'd', text: 'Containers in the same Pod cannot communicate across network ports' },
    ],
    correctOptionId: 'c',
    explanation: 'All containers in a Kubernetes Pod share a single network namespace (and therefore the same IP address and port space). Containers can communicate directly with each other over localhost using standard TCP/UDP ports.',
    conceptTag: 'k8s-multi-container-localhost',
  },

  // ============================================================================
  // MEDIUM / INTERMEDIATE (Questions 18 - 34)
  // ============================================================================
  {
    id: 'q-devops-k8s-18',
    difficulty: 'medium',
    question: 'What is the exact chronological sequence of events executed by the kubelet when a Pod is deleted via kubectl delete pod?',
    options: [
      { id: 'a', text: '1. Pod marked Terminating & removed from Endpoints -> 2. preStop hook executes -> 3. SIGTERM sent to containers -> 4. wait up to terminationGracePeriodSeconds -> 5. SIGKILL sent if still alive' },
      { id: 'b', text: '1. kubelet sends SIGKILL -> 2. preStop hook runs -> 3. Pod is removed from etcd' },
      { id: 'c', text: '1. SIGTERM sent -> 2. Pod marked Succeeded -> 3. preStop hook runs -> 4. cgroup unmounted' },
      { id: 'd', text: '1. Node cordoned -> 2. Pod memory dumped to host disk -> 3. container restarted' },
    ],
    correctOptionId: 'a',
    explanation: 'When deleted, the Pod is marked Terminating and immediately removed from Service Endpoints. Simultaneously, the kubelet executes the preStop hook (if defined). Once the preStop hook finishes, kubelet sends SIGTERM. If the container does not exit before terminationGracePeriodSeconds expires, SIGKILL is sent.',
    conceptTag: 'k8s-pod-termination-lifecycle',
  },
  {
    id: 'q-devops-k8s-19',
    difficulty: 'medium',
    question: 'During rolling deployments, clients experience intermittent HTTP 502 Bad Gateway errors. Why does adding a preStop sleep hook resolve this race condition?',
    codeSnippet: `lifecycle:
  preStop:
    exec:
      command: ["/bin/sleep", "10"]`,
    options: [
      { id: 'a', text: 'It pauses the Linux kernel CFS scheduler to allow pending disk writes to finish' },
      { id: 'b', text: 'It forces Kubernetes to promote the Pod to Guaranteed QoS' },
      { id: 'c', text: 'It flushes the CoreDNS cache across the entire cluster' },
      { id: 'd', text: 'It delays container shutdown to give kube-proxy and Ingress controllers sufficient time to propagate EndpointSlice removal and update routing tables across all nodes' },
    ],
    correctOptionId: 'd',
    explanation: 'Endpoint removal from kube-proxy iptables and ingress proxies is asynchronous. If the container process shuts down immediately upon receiving SIGTERM, in-flight or newly dispatched HTTP requests reach a closed socket, causing 502/504 errors. Sleeping 5-15s allows ingress routers to stop forwarding traffic before the app terminates.',
    conceptTag: 'k8s-prestop-sleep-race-condition',
  },
  {
    id: 'q-devops-k8s-20',
    difficulty: 'medium',
    question: 'What is the difference between voluntary and involuntary disruptions when configuring a PodDisruptionBudget (PDB)?',
    options: [
      { id: 'a', text: 'PDBs protect against involuntary hardware panics, but allow voluntary node drains' },
      { id: 'b', text: 'PDBs cannot prevent involuntary disruptions (e.g. hardware faults, kernel panics, or node network loss), but strictly enforce availability limits during voluntary disruptions (e.g. kubectl drain, cluster autoscaler scale-down, or node upgrades)' },
      { id: 'c', text: 'Voluntary disruptions apply only to daemonsets, while involuntary disruptions apply to statefulsets' },
      { id: 'd', text: 'PDBs restart the node automatically during involuntary disruptions' },
    ],
    correctOptionId: 'b',
    explanation: 'PodDisruptionBudgets enforce minimum available or maximum unavailable pods during voluntary, planned actions (node maintenance, cluster upgrades, autoscaler scale-down). They cannot protect against involuntary events like physical machine failures, power cuts, or sudden kernel panics.',
    conceptTag: 'k8s-pod-disruption-budgets',
  },
  {
    id: 'q-devops-k8s-21',
    difficulty: 'medium',
    question: 'Under what specific resource specification criteria does a Kubernetes Pod receive the "Guaranteed" Quality of Service (QoS) class?',
    codeSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: critical-service
spec:
  containers:
  - name: app
    resources:
      limits:
        cpu: "1000m"
        memory: "2Gi"
      requests:
        cpu: "1000m"
        memory: "2Gi"`,
    options: [
      { id: 'a', text: 'When every container in the Pod has both CPU and memory limits set, and the requests are explicitly equal to the limits' },
      { id: 'b', text: 'When the Pod runs in the kube-system namespace' },
      { id: 'c', text: 'When the Pod has at least one persistent volume claim attached' },
      { id: 'd', text: 'When priorityClassName is set to system-cluster-critical' },
    ],
    correctOptionId: 'a',
    explanation: 'A Pod is assigned the Guaranteed QoS class if and only if: every container in the Pod has both memory and CPU requests and limits configured, and for every container, the requests equal the limits (request == limit for both CPU and memory).',
    conceptTag: 'k8s-qos-guaranteed',
  },
  {
    id: 'q-devops-k8s-22',
    difficulty: 'medium',
    question: 'What characterizes the "BestEffort" QoS class in Kubernetes, and what risk does it carry during node resource contention?',
    options: [
      { id: 'a', text: 'Containers specify requests but no limits; they are throttled during high load' },
      { id: 'b', text: 'Containers are guaranteed up to 8GB of burstable memory from swap' },
      { id: 'c', text: 'Containers run with real-time CPU priority ring 0' },
      { id: 'd', text: 'Containers have no memory or CPU requests or limits specified at all; they are assigned oom_score_adj of 1000 and are the very first to be killed when a node runs out of memory' },
    ],
    correctOptionId: 'd',
    explanation: 'BestEffort pods have neither requests nor limits defined for any container. The kubelet assigns them an oom_score_adj of 1000. When the worker node experiences memory pressure, the Linux kernel OOM killer terminates BestEffort pods first to safeguard Burstable and Guaranteed workloads.',
    conceptTag: 'k8s-qos-besteffort',
  },
  {
    id: 'q-devops-k8s-23',
    difficulty: 'medium',
    question: 'How does the "Burstable" QoS class behave when a container consumes more memory than its requested amount?',
    options: [
      { id: 'a', text: 'The kubelet immediately evicts the Pod from the node' },
      { id: 'b', text: 'The container is allowed to use excess node memory up to its limit, but if the node experiences memory pressure, containers exceeding requests are targeted for eviction before Guaranteed pods' },
      { id: 'c', text: 'The Linux kernel CFS throttles the application memory allocation rate to 1MB/s' },
      { id: 'd', text: 'The container is automatically cloned into a second replica' },
    ],
    correctOptionId: 'b',
    explanation: 'Burstable pods (where requests < limits) can burst past their memory requests if the node has available RAM. However, if the node runs low on memory, the kernel calculates oom_score_adj based on how much the process exceeds its request; pods exceeding requests will be killed before pods staying within their requests.',
    conceptTag: 'k8s-qos-burstable',
  },
  {
    id: 'q-devops-k8s-24',
    difficulty: 'medium',
    question: 'An application pod suddenly terminates with exit code 137. How can an engineer conclusively verify whether it was killed due to an OOM condition versus an external SIGKILL command?',
    options: [
      { id: 'a', text: 'Run kubectl get events and search for FailedScheduling' },
      { id: 'b', text: 'Check the CoreDNS error logs for query timeouts' },
      { id: 'c', text: 'Inspect kubectl describe pod and check if Last State shows "Terminated", Reason: "OOMKilled"' },
      { id: 'd', text: 'OOMKilled cannot be distinguished from normal pod deletion in Kubernetes' },
    ],
    correctOptionId: 'c',
    explanation: 'kubectl describe pod <pod_name> reports the container termination status in the Last State section. If the cgroup memory limit was breached, Reason will explicitly display "OOMKilled" with Exit Code: 137.',
    conceptTag: 'k8s-oomkilled-troubleshooting',
  },
  {
    id: 'q-devops-k8s-25',
    difficulty: 'medium',
    question: 'What is the fundamental difference in system behavior when a container exceeds its CPU limit versus exceeding its Memory limit?',
    options: [
      { id: 'a', text: 'Exceeding CPU limit causes container termination; exceeding Memory limit causes CPU throttling' },
      { id: 'b', text: 'Exceeding CPU limit results in CPU throttling (CFS bandwidth control drops execution cycles); exceeding Memory limit triggers the OOM Killer which immediately terminates the process with SIGKILL' },
      { id: 'c', text: 'Both CPU and Memory breaches terminate the container with exit code 137' },
      { id: 'd', text: 'Neither causes termination; Kubernetes simply auto-scales the node' },
    ],
    correctOptionId: 'b',
    explanation: 'CPU is a compressible resource: when a container exceeds its CPU limit, the kernel CFS throttles its CPU time, causing higher latency but no process death. Memory is an incompressible resource: when a container exceeds its memory limit, the kernel cannot reclaim space and kills the process via SIGKILL (OOMKilled).',
    conceptTag: 'k8s-cpu-throttling-vs-oom',
  },
  {
    id: 'q-devops-k8s-26',
    difficulty: 'medium',
    question: 'What happens to traffic routing when a pod readinessProbe fails while its livenessProbe continues to pass?',
    options: [
      { id: 'a', text: 'The Endpoint controller removes the Pod IP from the Service EndpointSlice, stopping new traffic from reaching the pod while keeping the container running' },
      { id: 'b', text: 'The kubelet restarts the container immediately' },
      { id: 'c', text: 'The kubelet drains the node hosting the pod' },
      { id: 'd', text: 'The pod is deleted and recreated on a different node' },
    ],
    correctOptionId: 'a',
    explanation: 'When a readiness probe fails, Kubernetes updates the EndpointSlice to mark the endpoint as not ready (or removes it), so kube-proxy and Ingress controllers stop routing traffic to it. Because liveness still passes, the container is NOT restarted, allowing it to complete internal recovery.',
    conceptTag: 'k8s-readiness-endpoint-removal',
  },
  {
    id: 'q-devops-k8s-27',
    difficulty: 'medium',
    question: 'What is the role of the pause container (kubernetes/pause) inside every Kubernetes Pod?',
    options: [
      { id: 'a', text: 'It pauses and resumes user containers during garbage collection cycles' },
      { id: 'b', text: 'It stores container logs on local disk' },
      { id: 'c', text: 'It creates and holds the shared Linux namespaces (Network, IPC, UTS) for the Pod and acts as the PID 1 zombie reaper' },
      { id: 'd', text: 'It proxies TLS certificates from HashiCorp Vault' },
    ],
    correctOptionId: 'c',
    explanation: 'The pause container runs an assembly loop that sleeps. It acts as the parent of the Pod namespaces (creating the network namespace so the Pod gets its IP before user containers start) and serves as PID 1 to reap orphaned child processes if process namespace sharing is enabled.',
    conceptTag: 'k8s-pause-container',
  },
  {
    id: 'q-devops-k8s-28',
    difficulty: 'medium',
    question: 'How does configuring a postStart lifecycle hook affect container startup timing in Kubernetes?',
    codeSnippet: `lifecycle:
  postStart:
    exec:
      command: ["/bin/sh", "-c", "echo initializing >> /tmp/log"]`,
    options: [
      { id: 'a', text: 'The container ENTRYPOINT does not start until postStart finishes' },
      { id: 'b', text: 'postStart hooks run on the Kubernetes control plane master node' },
      { id: 'c', text: 'The postStart hook executes only after readinessProbe passes' },
      { id: 'd', text: 'The postStart hook executes asynchronously with the container ENTRYPOINT, but the Pod status remains in ContainerCreating until the postStart hook completes successfully' },
    ],
    correctOptionId: 'd',
    explanation: 'The postStart hook runs immediately after the container is created, asynchronously alongside the container ENTRYPOINT. However, the kubelet will not transition the container status to Running until postStart completes. If postStart fails (non-zero exit code), the container is killed.',
    conceptTag: 'k8s-poststart-hook-lifecycle',
  },
  {
    id: 'q-devops-k8s-29',
    difficulty: 'medium',
    question: 'What is the behavior of the terminationGracePeriodSeconds timer when a preStop hook is configured?',
    options: [
      { id: 'a', text: 'The preStop hook runs during an additional grace period that is added on top of terminationGracePeriodSeconds' },
      { id: 'b', text: 'The kubelet extends the timer by 60 seconds whenever preStop starts' },
      { id: 'c', text: 'preStop hooks disable terminationGracePeriodSeconds entirely' },
      { id: 'd', text: 'The preStop hook execution counts against the terminationGracePeriodSeconds limit; if the hook takes longer than the grace period, SIGKILL is sent immediately without waiting for SIGTERM handling' },
    ],
    correctOptionId: 'd',
    explanation: 'The terminationGracePeriodSeconds countdown begins as soon as the preStop hook is invoked. If preStop executes for 25 seconds of a 30-second grace period, the application has only 5 seconds left to handle SIGTERM before SIGKILL is dispatched.',
    conceptTag: 'k8s-prestop-grace-period-accounting',
  },
  {
    id: 'q-devops-k8s-30',
    difficulty: 'medium',
    question: 'How do initContainers execute relative to application containers within the same Pod?',
    options: [
      { id: 'a', text: 'They execute in parallel with application containers to pre-fetch dependencies' },
      { id: 'b', text: 'They run continuously in the background throughout the entire Pod lifecycle' },
      { id: 'c', text: 'They execute sequentially in the exact order defined in the spec, and each must terminate successfully (exit 0) before the next initContainer or application container is started' },
      { id: 'd', text: 'They only run if the primary application container crashes' },
    ],
    correctOptionId: 'c',
    explanation: 'InitContainers run serially before app containers start. If an initContainer fails, Kubernetes restarts the Pod (according to restartPolicy) until it succeeds. Only after all initContainers finish with exit code 0 do the regular app containers start in parallel.',
    conceptTag: 'k8s-init-containers-lifecycle',
  },
  {
    id: 'q-devops-k8s-31',
    difficulty: 'medium',
    question: 'Why does setting terminationGracePeriodSeconds: 0 on a StatefulSet risk data corruption if not coupled with force deletion flags?',
    options: [
      { id: 'a', text: 'StatefulSets automatically delete their PersistentVolumeClaims when grace period is 0' },
      { id: 'b', text: 'Immediate SIGKILL prevents the database engine from flushing WAL buffers and executing checkpoint flushes, leaving tables in an inconsistent crash-recovery state' },
      { id: 'c', text: 'StatefulSet ordinals decrement backwards when grace period is 0' },
      { id: 'd', text: 'The storage CSI plugin crashes when pods terminate instantly' },
    ],
    correctOptionId: 'b',
    explanation: 'Setting terminationGracePeriodSeconds to 0 immediately sends SIGKILL to the process, bypassing SIGTERM. State-heavy workloads (Postgres, Cassandra, Kafka) cannot finish in-flight transactions, flush write-ahead logs, or clean lockfiles, increasing the probability of data corruption upon restart.',
    conceptTag: 'k8s-statefulset-grace-period-zero',
  },
  {
    id: 'q-devops-k8s-32',
    difficulty: 'medium',
    question: 'How does Kubernetes EndpointSlice controller handle a Pod that is in the "Terminating" phase?',
    options: [
      { id: 'a', text: 'It marks the endpoint condition ready: false and serving: false (or ready: false, serving: true if using the terminate-endpoints feature gate), so standard Services drop it from active routing' },
      { id: 'b', text: 'It keeps routing all cluster traffic to the terminating pod until SIGKILL is received' },
      { id: 'c', text: 'It changes the Pod IP to 127.0.0.1 in the EndpointSlice' },
      { id: 'd', text: 'It restarts all client pods communicating with that endpoint' },
    ],
    correctOptionId: 'a',
    explanation: 'As soon as a pod deletionTimestamp is set, the endpoint controller sets Conditions.Ready = false on the corresponding EndpointSlice entry. Kube-proxy removes the endpoint from service load balancing, ensuring new connections are directed only to healthy, running pods.',
    conceptTag: 'k8s-endpointslice-terminating-condition',
  },
  {
    id: 'q-devops-k8s-33',
    difficulty: 'medium',
    question: 'In a Kubernetes Deployment, if readinessProbe is failing for all 3 replicas of an existing version while deploying a new version, what happens to the rollout?',
    options: [
      { id: 'a', text: 'The deployment immediately deletes the old pods and routes traffic to localhost' },
      { id: 'b', text: 'Kubernetes reboots the master control plane' },
      { id: 'c', text: 'The new pods will not proceed past maxSurge limits until their own readiness probes pass; existing traffic remains routed to whatever old pods are reachable or returns 503 if all endpoints are unready' },
      { id: 'd', text: 'The deployment controller switches the rollout strategy to Recreate automatically' },
    ],
    correctOptionId: 'c',
    explanation: 'The Deployment controller checks readiness probes of new pods before terminating old pods (governed by maxSurge and maxUnavailable). If the old pods fail readiness, the Service has zero healthy endpoints, but the Deployment rollout cannot magically advance until new pods pass their readiness checks.',
    conceptTag: 'k8s-rollout-readiness-interaction',
  },
  {
    id: 'q-devops-k8s-34',
    difficulty: 'medium',
    question: 'What is the purpose of setting shareProcessNamespace: true in a Kubernetes Pod spec?',
    options: [
      { id: 'a', text: 'It allows containers in the Pod to view and signal processes in other containers in the same Pod, and causes the pause container to reap zombies' },
      { id: 'b', text: 'It exposes all host OS root processes to the container' },
      { id: 'c', text: 'It enables multithreading across distinct physical nodes' },
      { id: 'd', text: 'It allows multiple pods to share the same CPU core without CFS throttling' },
    ],
    correctOptionId: 'a',
    explanation: 'When shareProcessNamespace: true is enabled, containers in a single Pod share a common Linux PID namespace. A sidecar container can inspect /proc of the primary application container, send signals (like SIGHUP for config reload), and PID 1 becomes the pause container which reaps orphaned zombies.',
    conceptTag: 'k8s-share-process-namespace',
  },

  // ============================================================================
  // HARD / ADVANCED (Questions 35 - 50)
  // ============================================================================
  {
    id: 'q-devops-k8s-35',
    difficulty: 'hard',
    question: 'When a worker node experiences disk or memory pressure, how does the Kubelet Eviction Manager rank pods for termination?',
    options: [
      { id: 'a', text: 'Guaranteed pods are evicted first, followed by Burstable, and BestEffort last' },
      { id: 'b', text: 'The kubelet evicts pods with the shortest uptime' },
      { id: 'c', text: 'Pods are evicted strictly in alphabetical order by Pod name' },
      { id: 'd', text: 'Pods are ranked first by QoS class (BestEffort first, then Burstable pods exceeding their requested resources), and secondly by Pod Priority and resource consumption exceeding request' },
    ],
    correctOptionId: 'd',
    explanation: 'The Kubelet Eviction Manager ranks pods for eviction by: 1. QoS class: BestEffort pods first, then Burstable pods consuming more than requested; 2. Pod Priority; 3. Resource usage relative to requests. Guaranteed pods (and Burstable pods consuming under their requests) are only evicted as a last resort.',
    conceptTag: 'k8s-kubelet-eviction-ranking',
  },
  {
    id: 'q-devops-k8s-36',
    difficulty: 'hard',
    question: 'What is the difference between a soft eviction threshold and a hard eviction threshold in kubelet eviction configuration?',
    options: [
      { id: 'a', text: 'Soft evictions reboot the node; hard evictions delete the cluster' },
      { id: 'b', text: 'Hard evictions (e.g. memory.available < 100Mi) trigger immediate pod termination without observing terminationGracePeriodSeconds; soft evictions allow an eviction-grace-period before pods are terminated' },
      { id: 'c', text: 'Soft evictions apply to CPU; hard evictions apply to RAM' },
      { id: 'd', text: 'Soft evictions only log warnings to syslog without killing containers' },
    ],
    correctOptionId: 'b',
    explanation: 'Hard eviction thresholds (eviction-hard) act immediately: pods are evicted without waiting for terminationGracePeriodSeconds. Soft eviction thresholds (eviction-soft) pair with eviction-soft-grace-period: the condition must persist for that duration before eviction begins, and pods are granted their terminationGracePeriodSeconds.',
    conceptTag: 'k8s-eviction-soft-vs-hard',
  },
  {
    id: 'q-devops-k8s-37',
    difficulty: 'hard',
    question: 'How do Ephemeral Containers (introduced for debugging running pods via kubectl debug) differ from standard containers in a Pod?',
    options: [
      { id: 'a', text: 'Ephemeral containers cannot have ports, probes, or lifecycle hooks, cannot be restarted, and are added dynamically to an already running pod without modifying the immutable spec.containers' },
      { id: 'b', text: 'Ephemeral containers lack resource limits and run in Ring 0' },
      { id: 'c', text: 'Ephemeral containers execute on a separate remote worker node' },
      { id: 'd', text: 'Ephemeral containers are destroyed after 60 seconds of inactivity' },
    ],
    correctOptionId: 'a',
    explanation: 'Ephemeral containers (ephemeralContainers) are designed for troubleshooting live pods (e.g. distroless images without shells). Because Pod spec.containers is immutable, ephemeral containers are injected via the /ephemeralcontainers subresource. They lack ports, probes, and restart capabilities.',
    conceptTag: 'k8s-ephemeral-containers',
  },
  {
    id: 'q-devops-k8s-38',
    difficulty: 'hard',
    question: 'In Kubernetes 1.28+, how does the Native Sidecar Container feature (initContainers with restartPolicy: Always) revolutionize sidecar lifecycle management?',
    codeSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: job-with-proxy
spec:
  initContainers:
  - name: istio-proxy
    image: istio/proxyv2:1.20
    restartPolicy: Always
  containers:
  - name: job-worker
    image: batch-job:v1`,
    options: [
      { id: 'a', text: 'It terminates the sidecar proxy immediately when the pod is created' },
      { id: 'b', text: 'It merges the sidecar container filesystem into the host rootfs' },
      { id: 'c', text: 'It forces the proxy to run inside the Linux kernel via eBPF' },
      { id: 'd', text: 'The sidecar starts before normal containers and blocks until startupProbe passes, and during shutdown, normal containers terminate before the sidecar shuts down, solving the long-standing "sidecar keeping batch Jobs alive" bug' },
    ],
    correctOptionId: 'd',
    explanation: 'Historically, sidecars ran in spec.containers and batch Jobs never reached "Completed" because the sidecar ran forever. Native sidecars (initContainers with restartPolicy: Always) start first, wait for startupProbe, stay running throughout the pod life, and terminate AFTER all normal containers exit 0 in Jobs.',
    conceptTag: 'k8s-native-sidecar-containers',
  },
  {
    id: 'q-devops-k8s-39',
    difficulty: 'hard',
    question: 'How does Pod Topology Spread Constraints maxSkew govern pod placement across failure domains?',
    codeSnippet: `topologySpreadConstraints:
- maxSkew: 1
  topologyKey: topology.kubernetes.io/zone
  whenUnsatisfiable: DoNotSchedule
  labelSelector:
    matchLabels:
      app: web`,
    options: [
      { id: 'a', text: 'maxSkew: 1 means no two pods of app: web can ever run in the same cloud region' },
      { id: 'b', text: 'maxSkew: 1 specifies that the difference between the number of matching pods in any two zones (or between any zone and the global minimum) cannot exceed 1' },
      { id: 'c', text: 'maxSkew defines how many seconds the scheduler can wait before failing' },
      { id: 'd', text: 'maxSkew: 1 allows up to 100 pods per availability zone' },
    ],
    correctOptionId: 'b',
    explanation: 'maxSkew defines the maximum allowed difference in the number of matching pods between any two topology domains (or between a domain and the minimum). With maxSkew: 1 and DoNotSchedule, if zone A has 2 pods and zone B has 1 pod, a new pod cannot be placed in zone A.',
    conceptTag: 'k8s-topology-spread-maxskew',
  },
  {
    id: 'q-devops-k8s-40',
    difficulty: 'hard',
    question: 'What is the key architectural difference between Pod Anti-Affinity and Pod Topology Spread Constraints?',
    options: [
      { id: 'a', text: 'Anti-Affinity is evaluated by kube-proxy, while Topology Spread is evaluated by kubelet' },
      { id: 'b', text: 'Topology Spread Constraints are deprecated in favor of NodeSelectors' },
      { id: 'c', text: 'Pod Anti-Affinity is strictly binary (it only allows 0 or 1 matching pod per topology domain), whereas Topology Spread allows an arbitrary, evenly distributed number of pods across domains controlled by maxSkew' },
      { id: 'd', text: 'Anti-Affinity only works on bare-metal clusters' },
    ],
    correctOptionId: 'c',
    explanation: 'Pod Anti-Affinity with requiredDuringScheduling is a binary constraint: it prevents more than 1 pod with a given label from being scheduled onto the same topologyKey (e.g. max 1 pod per node). Topology Spread Constraints allow N pods per zone/node while enforcing an even distribution within maxSkew tolerance.',
    conceptTag: 'k8s-antiaffinity-vs-topologyspread',
  },
  {
    id: 'q-devops-k8s-41',
    difficulty: 'hard',
    question: 'Why does setting an aggressive CPU limit (e.g. resources.limits.cpu: 500m) cause severe p99 response time spikes in high-throughput multithreaded web services, even when average CPU utilization is only 20%?',
    options: [
      { id: 'a', text: 'The Linux kernel drops TCP packets when CPU limits are enabled' },
      { id: 'b', text: 'The Linux CFS scheduler enforces limits across a 100ms window (cfs_period_us). A burst across multiple concurrent worker threads consumes the 50ms quota in the first few milliseconds, causing all threads to be frozen for the remainder of the 100ms period' },
      { id: 'c', text: 'Kubernetes migrates the pod to a different node on every CFS period' },
      { id: 'd', text: 'CFS throttling forces the container process to swap memory to disk' },
    ],
    correctOptionId: 'b',
    explanation: 'Linux CFS bandwidth control operates on a 100ms window (cpu.cfs_period_us = 100,000us). A 500m limit grants 50ms (50,000us) of total CPU time per period. If an 8-thread runtime (like Node.js worker threads, Go, or Java) bursts concurrently, 8 * 6.25ms = 50ms of CPU time is consumed in just 7 milliseconds, freezing the entire application for the next 93 milliseconds.',
    conceptTag: 'k8s-cfs-cpu-quota-throttling-latency',
  },
  {
    id: 'q-devops-k8s-42',
    difficulty: 'hard',
    question: 'How does the Kubernetes API server implement optimistic concurrency control on resource updates to prevent lost updates?',
    options: [
      { id: 'a', text: 'Through the metadata.resourceVersion field: if the client submits an update with a stale resourceVersion, the API server rejects the request with HTTP 409 Conflict' },
      { id: 'b', text: 'By acquiring distributed Redis distributed locks on the resource URI' },
      { id: 'c', text: 'By buffering all incoming HTTP PUT requests in a Kafka topic' },
      { id: 'd', text: 'By running etcd transactions in single-threaded SERIALIZABLE isolation' },
    ],
    correctOptionId: 'a',
    explanation: 'The kube-apiserver uses metadata.resourceVersion (derived from the etcd modification revision) for optimistic locking. When updating a resource, clients pass the resourceVersion they read. If another client modified the resource in the meantime, the versions mismatch, and the API server returns HTTP 409 Conflict.',
    conceptTag: 'k8s-apiserver-resourceversion-conflict',
  },
  {
    id: 'q-devops-k8s-43',
    difficulty: 'hard',
    question: 'In Kubernetes controllers and operators, what problem occurs when an etcd Watch stream fails with "too old resource version"?',
    options: [
      { id: 'a', text: 'The controller has not refreshed its client certificates' },
      { id: 'b', text: 'The worker node system time is out of sync with NTP' },
      { id: 'c', text: 'etcd has compacted its historical revision log past the revision the controller was watching; the controller must reset its watch by performing a full List operation and restarting the watch from the latest revision' },
      { id: 'd', text: 'The container image was built with an unsupported version of Go' },
    ],
    correctOptionId: 'c',
    explanation: 'etcd periodically compacts its historical key-value revisions to reclaim disk space. If a controller client experiences network disconnection or processing delays and tries to resume watching from a compacted resourceVersion, etcd rejects it with "too old resource version". The controller (Informer/Reflector) must perform a full LIST to re-sync.',
    conceptTag: 'k8s-etcd-watch-compaction',
  },
  {
    id: 'q-devops-k8s-44',
    difficulty: 'hard',
    question: 'How is Node Allocatable calculated by the Kubelet on a worker node, and what formula defines the schedulable capacity for user pods?',
    options: [
      { id: 'a', text: 'Node Allocatable = Total RAM - Swap' },
      { id: 'b', text: 'Node Allocatable = sum of all running container requests' },
      { id: 'c', text: 'Node Allocatable = Node Capacity * 0.75' },
      { id: 'd', text: 'Node Allocatable = Node Capacity - kube-reserved - system-reserved - eviction-hard threshold' },
    ],
    correctOptionId: 'd',
    explanation: 'Node Allocatable defines the real resource capacity available for pods: Node Capacity minus [kube-reserved (kubelet/container runtime overhead) + system-reserved (OS daemons like sshd/systemd) + eviction-hard (threshold reserves for eviction manager)]. The scheduler only assigns pods based on Allocatable.',
    conceptTag: 'k8s-node-allocatable-calculation',
  },
  {
    id: 'q-devops-k8s-45',
    difficulty: 'hard',
    question: 'If a postStart lifecycle hook fails (exits with non-zero status code or hangs), what exact behavior does the kubelet exhibit?',
    options: [
      { id: 'a', text: 'The kubelet logs a warning to stderr and continues running the container normally' },
      { id: 'b', text: 'The kubelet automatically falls back to executing the preStop hook' },
      { id: 'c', text: 'The kubelet restarts the control plane API server' },
      { id: 'd', text: 'The kubelet kills the container and subjects it to the Pod restartPolicy, preventing the Pod from ever transitioning to Running' },
    ],
    correctOptionId: 'd',
    explanation: 'PostStart hooks must complete with exit code 0. If a postStart hook fails or times out, the kubelet kills the container process immediately and restarts it according to the Pod restartPolicy. The container status will show CrashLoopBackOff or Error.',
    conceptTag: 'k8s-poststart-failure-behavior',
  },
  {
    id: 'q-devops-k8s-46',
    difficulty: 'hard',
    question: 'How does the Kubernetes Downward API allow a container to discover its own CPU and memory limits without granting the container RBAC access to the API server?',
    codeSnippet: `env:
- name: MY_CPU_LIMIT
  valueFrom:
    resourceFieldRef:
      containerName: my-app
      resource: limits.cpu`,
    options: [
      { id: 'a', text: 'By exposing the kube-apiserver secret token to all processes' },
      { id: 'b', text: 'Via an internal eBPF program running on port 8080' },
      { id: 'c', text: 'The kubelet inspects the Pod specification and injects the requested metadata directly into environment variables or volume-mounted files during container setup' },
      { id: 'd', text: 'By reading the host /etc/machine-id file' },
    ],
    correctOptionId: 'c',
    explanation: 'The Downward API allows pod and container metadata (like pod name, namespace, IP, annotations, or CPU/memory requests and limits) to be exposed directly to containers via environment variables (fieldRef/resourceFieldRef) or downwardAPI volumes, removing the need for pods to query the API server.',
    conceptTag: 'k8s-downward-api',
  },
  {
    id: 'q-devops-k8s-47',
    difficulty: 'hard',
    question: 'What happens during a graceful node drain (kubectl drain node-1) if a Pod is protected by a PodDisruptionBudget that currently permits 0 disruptions (currentHealthy == minAvailable)?',
    options: [
      { id: 'a', text: 'The drain command ignores the PDB after 10 seconds and deletes the pod' },
      { id: 'b', text: 'The eviction subresource API rejects the eviction with 429 Too Many Requests, causing kubectl drain to block and continuously retry until another replica becomes ready or the command times out' },
      { id: 'c', text: 'The node immediately reboots with a kernel panic' },
      { id: 'd', text: 'The PDB is automatically deleted by the Eviction Controller' },
    ],
    correctOptionId: 'b',
    explanation: 'kubectl drain uses the Eviction API (/pods/eviction). If evicting a pod would violate its PodDisruptionBudget, the API returns HTTP 429 (Too Many Requests / Cannot evict pod as it would violate the disruption budget). The drain command loops waiting for new pods to become healthy elsewhere before proceeding.',
    conceptTag: 'k8s-pdb-drain-eviction-block',
  },
  {
    id: 'q-devops-k8s-48',
    difficulty: 'hard',
    question: 'How does the Linux kernel oom_score_adj value differ across Kubernetes QoS classes on a worker node?',
    options: [
      { id: 'a', text: 'Guaranteed: -997, Burstable: calculated (min 2, max 999 based on requests vs node memory), BestEffort: 1000' },
      { id: 'b', text: 'All pods have oom_score_adj set to 0 by default' },
      { id: 'c', text: 'Guaranteed: 1000, BestEffort: -1000' },
      { id: 'd', text: 'Only pods running as root have oom_score_adj configured' },
    ],
    correctOptionId: 'a',
    explanation: 'The kubelet configures /proc/[pid]/oom_score_adj: Guaranteed pods get -997 (virtually immune from OOM killing unless system processes fail); BestEffort pods get 1000 (maximum likelihood of being killed first); Burstable pods receive an adjusted value between 2 and 999 based on how much memory they request relative to node allocatable.',
    conceptTag: 'k8s-oom-score-adj-qos',
  },
  {
    id: 'q-devops-k8s-49',
    difficulty: 'hard',
    question: 'When configuring Pod Readiness Gates (spec.readinessGates), how does an external cloud ingress controller (e.g. AWS Load Balancer Controller or GKE NEG) influence pod readiness?',
    codeSnippet: `spec:
  readinessGates:
  - conditionType: "target-health.alb.k8s.aws/k8s-app"` ,
    options: [
      { id: 'a', text: 'The cloud load balancer will shut down if the container readinessProbe fails' },
      { id: 'b', text: 'Readiness gates bypass the kube-proxy iptables entirely' },
      { id: 'c', text: 'The Pod will NOT be marked Ready in its Pod status until both container readiness probes pass AND the external load balancer controller updates the conditionType to True after registering the target in the cloud target group' },
      { id: 'd', text: 'The cloud provider bills the cluster for a dedicated VPC gateway per readiness gate' },
    ],
    correctOptionId: 'c',
    explanation: 'Readiness Gates allow external controllers (like AWS ALB or GCP NEG) to inject custom readiness conditions into pod.status.conditions. A pod is only considered Ready overall when container probes pass AND all readinessGates evaluate to True, preventing rollouts from completing before cloud load balancers register target health.',
    conceptTag: 'k8s-readiness-gates-cloud-lb',
  },
  {
    id: 'q-devops-k8s-50',
    difficulty: 'hard',
    question: 'In Kubernetes Pod scheduling, what is the role of the PriorityClass and preemption mechanism when a high-priority pod is Pending due to insufficient cluster resources?',
    options: [
      { id: 'a', text: 'The scheduler identifies candidate worker nodes and preempts (gracefully evicts) lower-priority pods to free up requested resources so the higher-priority pod can be scheduled' },
      { id: 'b', text: 'The scheduler increases the CPU clock rate on worker nodes' },
      { id: 'c', text: 'The API server automatically purchases additional cloud compute nodes via Terraform' },
      { id: 'd', text: 'Preemption deletes all daemonsets on the target node' },
    ],
    correctOptionId: 'a',
    explanation: 'When a pod has a high PriorityClass (e.g. priority: 1000000) and cannot be scheduled due to resource constraints, the kube-scheduler initiates preemption: it finds a node where evicting lower-priority pods frees enough CPU/memory, initiates their graceful termination, and assigns the node to the high-priority pod.',
    conceptTag: 'k8s-priority-class-preemption',
  },
];
