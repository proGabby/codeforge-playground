import type { QuizQuestion } from '../../../../src/types';

export const DOCKER_INTERNALS_50_QUESTIONS: QuizQuestion[] = [
  // ============================================================================
  // EASY / FOUNDATIONAL (Questions 1 - 17)
  // ============================================================================
  {
    id: 'q-devops-docker-1',
    difficulty: 'easy',
    question: 'How does Docker determine whether to use a cached layer during a build when evaluating a RUN instruction?',
    options: [
      { id: 'a', text: 'Docker checks whether the exact command string matches an existing layer in cache whose parent layer is identical' },
      { id: 'b', text: 'Docker inspects the checksum of all files in the container filesystem after the command finishes' },
      { id: 'c', text: 'Docker runs the command in a sandbox and checks if network requests return identical payloads' },
      { id: 'd', text: 'Docker caches RUN instructions only if the developer specifies the --cache-from flag' },
    ],
    correctOptionId: 'a',
    explanation: 'For RUN instructions, Docker does not inspect the contents of files modified by the command. Instead, it checks the command string itself and the hash of the parent layer. If both match an existing layer in the local cache, the cached layer is reused.',
    conceptTag: 'docker-layer-caching',
  },
  {
    id: 'q-devops-docker-2',
    difficulty: 'easy',
    question: 'A Node.js application Dockerfile takes several minutes to build on every single commit, even when dependencies have not changed. What ordering optimization resolves this cache invalidation problem?',
    codeSnippet: `# Current Dockerfile:
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]`,
    options: [
      { id: 'a', text: 'Run npm install --production instead of npm install' },
      { id: 'b', text: 'Copy package.json and package-lock.json first, run npm install, then COPY the rest of the application files' },
      { id: 'c', text: 'Replace WORKDIR /app with RUN cd /app' },
      { id: 'd', text: 'Combine COPY . . and CMD ["node", "server.js"] into a single layer' },
    ],
    correctOptionId: 'b',
    explanation: 'By copying package*.json and running npm install before copying the rest of the source code, npm install will be cached and skipped whenever only application code changes. With COPY . . first, any file change invalidates the cache for all subsequent instructions.',
    conceptTag: 'dockerfile-instruction-order',
  },
  {
    id: 'q-devops-docker-3',
    difficulty: 'easy',
    question: 'What is the primary operational difference between the COPY and ADD instructions in a Dockerfile?',
    options: [
      { id: 'a', text: 'COPY only supports directories, while ADD only supports individual files' },
      { id: 'b', text: 'COPY copies local files/directories into the image; ADD also supports remote URLs and automatically extracts recognized local compressed tar archives' },
      { id: 'c', text: 'COPY executes during container runtime, while ADD executes during image build time' },
      { id: 'd', text: 'ADD is faster than COPY because it bypasses the Docker daemon build context' },
    ],
    correctOptionId: 'b',
    explanation: 'COPY is preferred for simply copying files from the build context to the container filesystem. ADD provides additional features: extracting local tar archives (tar.gz, tar.bz2, etc.) into the target directory, and fetching files from remote URLs (though curl/wget in a RUN is preferred for URLs).',
    conceptTag: 'docker-copy-vs-add',
  },
  {
    id: 'q-devops-docker-4',
    difficulty: 'easy',
    question: 'In Docker, what is the critical difference between the "exec form" and the "shell form" of CMD and ENTRYPOINT?',
    codeSnippet: `# Exec form:
ENTRYPOINT ["node", "server.js"]

# Shell form:
ENTRYPOINT node server.js`,
    options: [
      { id: 'a', text: 'The exec form requires Python to parse JSON arrays' },
      { id: 'b', text: 'The exec form cannot take command-line arguments at runtime' },
      { id: 'c', text: 'The shell form runs with root privileges, whereas the exec form runs as an unprivileged user' },
      { id: 'd', text: 'The shell form spawns /bin/sh -c as PID 1, which blocks signals like SIGTERM from reaching the target application process' },
    ],
    correctOptionId: 'd',
    explanation: 'The exec form (JSON array syntax) executes the binary directly as PID 1 inside the container, ensuring that signals like SIGTERM and SIGINT are delivered directly to the application. The shell form executes /bin/sh -c, making the shell PID 1, which typically ignores SIGTERM and prevents graceful shutdowns.',
    conceptTag: 'docker-entrypoint-cmd-exec-form',
  },
  {
    id: 'q-devops-docker-5',
    difficulty: 'easy',
    question: 'Given the following Dockerfile, what command actually executes when a developer runs: docker run --rm my-image --port=8080?',
    codeSnippet: `FROM alpine:3.19
ENTRYPOINT ["python3", "-m", "http.server"]
CMD ["80"]`,
    options: [
      { id: 'a', text: '80 --port=8080' },
      { id: 'b', text: 'python3 -m http.server --port=8080' },
      { id: 'c', text: 'python3 -m http.server 80' },
      { id: 'd', text: '--port=8080 python3 -m http.server' },
    ],
    correctOptionId: 'b',
    explanation: 'When both ENTRYPOINT and CMD are specified, ENTRYPOINT defines the executable and CMD provides default arguments. Arguments passed to docker run override CMD completely while appending to ENTRYPOINT. Therefore, CMD ["80"] is replaced by --port=8080.',
    conceptTag: 'docker-entrypoint-cmd-override',
  },
  {
    id: 'q-devops-docker-6',
    difficulty: 'easy',
    question: 'How do you completely override the ENTRYPOINT of a container when running it via the Docker CLI?',
    options: [
      { id: 'a', text: 'docker run --override-entrypoint "/bin/sh" my-image' },
      { id: 'b', text: 'docker run --cmd "/bin/sh" my-image' },
      { id: 'c', text: 'docker run -e ENTRYPOINT="/bin/sh" my-image' },
      { id: 'd', text: 'docker run --entrypoint "/bin/sh" my-image' },
    ],
    correctOptionId: 'd',
    explanation: 'The --entrypoint flag on docker run overrides the Dockerfile ENTRYPOINT. Notice that any arguments passed after the image name become the new CMD arguments passed to that entrypoint.',
    conceptTag: 'docker-entrypoint-flag',
  },
  {
    id: 'q-devops-docker-7',
    difficulty: 'easy',
    question: 'Why is it critical to include .git, node_modules, and target/ directories inside a project .dockerignore file?',
    options: [
      { id: 'a', text: 'It prevents uploading gigabytes of unnecessary local files across the Docker daemon socket and stops host OS-specific binaries from poisoning container layers' },
      { id: 'b', text: 'Docker will fail to compile any Dockerfile if .git is detected in the repository' },
      { id: 'c', text: 'Files matching .dockerignore are permanently deleted from the host filesystem upon build' },
      { id: 'd', text: '.dockerignore is required to enable multi-stage builds' },
    ],
    correctOptionId: 'a',
    explanation: 'Before building, Docker CLI sends the entire build context to the Docker daemon. A missing .dockerignore transfers massive histories (.git) and host-compiled native modules (node_modules), severely slowing builds and risking host architecture incompatibility.',
    conceptTag: 'dockerignore-basics',
  },
  {
    id: 'q-devops-docker-8',
    difficulty: 'easy',
    question: 'What happens when a developer runs docker build . in their root directory if no .dockerignore file exists and large video files are present?',
    options: [
      { id: 'a', text: 'The build aborts immediately with an ErrContextExceeded error' },
      { id: 'b', text: 'The Docker client automatically filters out files larger than 100MB' },
      { id: 'c', text: 'The Docker client packages the entire directory into a tar archive and sends it to the daemon, causing a lengthy "Sending build context to Docker daemon" delay' },
      { id: 'd', text: 'The video files are compressed into WebP layers automatically' },
    ],
    correctOptionId: 'c',
    explanation: 'The Docker client tars the entire directory specified as the build context (.) and uploads it to the Docker engine before executing the Dockerfile. Without .dockerignore, all files in that directory are transmitted, regardless of whether a COPY instruction ever references them.',
    conceptTag: 'docker-build-context-transfer',
  },
  {
    id: 'q-devops-docker-9',
    difficulty: 'easy',
    question: 'What is the primary benefit of using a multi-stage Docker build as shown below?',
    codeSnippet: `# Stage 1: Build
FROM golang:1.22-alpine AS builder
WORKDIR /src
COPY . .
RUN go build -o /bin/api main.go

# Stage 2: Runtime
FROM alpine:3.19
WORKDIR /app
COPY --from=builder /bin/api /app/api
CMD ["/app/api"]`,
    options: [
      { id: 'a', text: 'It compiles the Go binary twice to check for memory leaks' },
      { id: 'b', text: 'It allows the container to run without Alpine Linux kernel packages' },
      { id: 'c', text: 'It runs the first stage on x86 and the second stage on ARM automatically' },
      { id: 'd', text: 'It leaves behind the Go compiler, SDK, build caches, and source files, resulting in a minimal, secure final image containing only the compiled binary and runtime OS' },
    ],
    correctOptionId: 'd',
    explanation: 'Multi-stage builds allow developers to use large SDKs and build tools in an intermediate stage (builder), and then selectively copy only the compiled artifacts into a lightweight production stage, drastically shrinking final image size and reducing security vulnerabilities.',
    conceptTag: 'docker-multi-stage-builds',
  },
  {
    id: 'q-devops-docker-10',
    difficulty: 'easy',
    question: 'Why is COPY --chown=node:node . /app preferred over running RUN chown -R node:node /app in a subsequent step?',
    codeSnippet: `# Scenario A:
COPY . /app
RUN chown -R node:node /app

# Scenario B:
COPY --chown=node:node . /app`,
    options: [
      { id: 'a', text: 'Scenario A duplicates the entire size of the copied files in a new layer because modifying file permissions creates a copy in the union filesystem' },
      { id: 'b', text: 'Scenario A causes Docker to crash if the user "node" is not in /etc/sudoers' },
      { id: 'c', text: 'Scenario B bypasses Linux file ownership checks at runtime' },
      { id: 'd', text: 'Scenario B requires Docker Buildx enterprise licensing' },
    ],
    correctOptionId: 'a',
    explanation: 'Because Docker layers use copy-on-write union filesystems, changing permissions with RUN chown duplicates all modified files in a new layer, doubling image storage usage for those files. COPY --chown assigns ownership during file copy without an extra layer.',
    conceptTag: 'docker-chown-layer-duplication',
  },
  {
    id: 'q-devops-docker-11',
    difficulty: 'easy',
    question: 'Why should apt-get update and apt-get install always be combined into a single RUN instruction in Debian/Ubuntu Dockerfiles?',
    codeSnippet: `# Bad Practice:
RUN apt-get update
RUN apt-get install -y curl

# Good Practice:
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*`,
    options: [
      { id: 'a', text: 'Running apt-get install creates a root daemon that prevents subsequent Docker instructions' },
      { id: 'b', text: 'Debian prohibits running apt-get install in a separate process' },
      { id: 'c', text: 'If separated into two RUN lines, apt-get update will be cached and never re-executed when package lists change, resulting in outdated or failing installs' },
      { id: 'd', text: 'Combining them enables multi-threading in apt-get' },
    ],
    correctOptionId: 'c',
    explanation: 'If RUN apt-get update is on its own line, Docker caches it. When you modify the install line to add new packages later, Docker reuses the stale apt-get update layer, leading to package not found errors or outdated security patches. Combining them ensures fresh repository indexes.',
    conceptTag: 'docker-apt-cache-busting',
  },
  {
    id: 'q-devops-docker-12',
    difficulty: 'easy',
    question: 'Why does RUN cd /app not change the working directory for subsequent instructions in a Dockerfile?',
    codeSnippet: `FROM debian:bookworm-slim
RUN cd /app
COPY app.js .
CMD ["node", "app.js"]`,
    options: [
      { id: 'a', text: 'Debian does not include the cd command in bookworm-slim' },
      { id: 'b', text: 'Each RUN instruction spawns an isolated subshell in a separate container layer; process state changes like current working directory do not persist across layers' },
      { id: 'c', text: 'The directory /app must be owned by root:root' },
      { id: 'd', text: 'RUN instructions cannot modify filesystem paths' },
    ],
    correctOptionId: 'b',
    explanation: 'Each RUN instruction runs in an isolated temporary container process. Changing directories with cd only affects that transient subshell. To set a persistent working directory for subsequent instructions, the WORKDIR instruction must be used.',
    conceptTag: 'docker-workdir-vs-cd',
  },
  {
    id: 'q-devops-docker-13',
    difficulty: 'easy',
    question: 'What is the operational difference between ARG and ENV in a Dockerfile?',
    options: [
      { id: 'a', text: 'ARG values persist into running containers, whereas ENV variables only exist during docker build' },
      { id: 'b', text: 'ARG can only be used in multi-stage builds, while ENV works exclusively in single-stage builds' },
      { id: 'c', text: 'ARG variables are only available during the Docker image build process, whereas ENV variables persist into the image metadata and running container environment' },
      { id: 'd', text: 'ENV variables are encrypted using AES-256 while ARG variables are plaintext' },
    ],
    correctOptionId: 'c',
    explanation: 'ARG defines build-time variables passed via --build-arg that do not persist in container runtime environments (unless explicitly passed into an ENV instruction). ENV defines environment variables that are baked into the image config and persist during container execution.',
    conceptTag: 'docker-arg-vs-env',
  },
  {
    id: 'q-devops-docker-14',
    difficulty: 'easy',
    question: 'How can you instruct Docker to build only up to a specific stage in a multi-stage Dockerfile during local development?',
    codeSnippet: `FROM golang:1.22 AS dev
WORKDIR /app
COPY . .
RUN go install github.com/air-verse/air@latest
CMD ["air"]

FROM dev AS build
RUN go build -o /bin/api .

FROM alpine:3.19 AS prod
COPY --from=build /bin/api /bin/api
CMD ["/bin/api"]`,
    options: [
      { id: 'a', text: 'docker build --target dev -t my-app:dev .' },
      { id: 'b', text: 'docker build --stage dev -t my-app:dev .' },
      { id: 'c', text: 'docker build --stop-at dev -t my-app:dev .' },
      { id: 'd', text: 'docker build --select dev -t my-app:dev .' },
    ],
    correctOptionId: 'a',
    explanation: 'The --target flag allows you to target a specific stage defined with AS <stage_name> in a multi-stage Dockerfile. Docker will stop building once that stage is complete, skipping subsequent production stages.',
    conceptTag: 'docker-target-stage',
  },
  {
    id: 'q-devops-docker-15',
    difficulty: 'easy',
    question: 'Does specifying EXPOSE 8080 in a Dockerfile automatically publish port 8080 to the host network interface?',
    options: [
      { id: 'a', text: 'Yes, EXPOSE 8080 binds port 8080 directly to 0.0.0.0 on the host machine' },
      { id: 'b', text: 'No, EXPOSE blocks inbound traffic to that port unless an ingress controller is deployed' },
      { id: 'c', text: 'Yes, but only if the host is running a Linux kernel version 5.x or above' },
      { id: 'd', text: 'No, EXPOSE functions purely as documentation between image author and operator; the port must still be published explicitly using -p or -P at runtime' },
    ],
    correctOptionId: 'd',
    explanation: 'EXPOSE does not publish ports to the host network. It acts as documentation metadata indicating which ports the service listens on. To publish ports to the host interface, you must pass -p <host_port>:<container_port> or -P (publish all exposed ports to ephemeral ports).',
    conceptTag: 'docker-expose-semantics',
  },
  {
    id: 'q-devops-docker-16',
    difficulty: 'easy',
    question: 'An engineer downloads a 500MB zip file in one RUN instruction and deletes it in a subsequent RUN instruction. What happens to the final image size?',
    codeSnippet: `RUN wget https://example.com/huge-dataset.zip
RUN rm -f huge-dataset.zip`,
    options: [
      { id: 'a', text: 'The image size is reduced by 500MB because the file was deleted before the final CMD' },
      { id: 'b', text: 'The image still contains the 500MB file because layer 1 is immutable; layer 2 merely masks the file in the union filesystem' },
      { id: 'c', text: 'Docker detects the deletion and automatically compresses the underlying layer' },
      { id: 'd', text: 'The build fails with a LayerMissingChecksum exception' },
    ],
    correctOptionId: 'b',
    explanation: 'Docker image layers are immutable read-only snapshots. Adding a 500MB file in layer 1 writes it to disk permanently in that layer. Deleting it in layer 2 creates a whiteout marker that hides it from view, but the 500MB still contributes to the total image download size.',
    conceptTag: 'docker-layer-immutability',
  },
  {
    id: 'q-devops-docker-17',
    difficulty: 'easy',
    question: 'Can COPY --from reference an external Docker Hub image directly instead of an earlier stage in the same Dockerfile?',
    codeSnippet: `FROM debian:bookworm-slim
COPY --from=nginx:alpine /etc/nginx/nginx.conf /etc/nginx/nginx.conf
CMD ["cat", "/etc/nginx/nginx.conf"]`,
    options: [
      { id: 'a', text: 'Yes, Docker will pull the referenced external image if not present locally and copy the requested files directly into the target layer' },
      { id: 'b', text: 'No, COPY --from can only reference stages named with AS within the current Dockerfile' },
      { id: 'c', text: 'Yes, but only if the source and destination images share the same parent Linux distribution' },
      { id: 'd', text: 'No, it requires an intermediate docker save and docker load step' },
    ],
    correctOptionId: 'a',
    explanation: 'COPY --from can reference another stage in the build or any external container image (such as COPY --from=golang:1.22 /usr/local/go /usr/local/go). If the image is not found locally, Docker pulls it automatically from the registry.',
    conceptTag: 'docker-copy-from-external-image',
  },

  // ============================================================================
  // MEDIUM / INTERMEDIATE (Questions 18 - 34)
  // ============================================================================
  {
    id: 'q-devops-docker-18',
    difficulty: 'medium',
    question: 'How does the Linux PID namespace enable container isolation while allowing the host kernel to manage container processes?',
    options: [
      { id: 'a', text: 'It creates a virtual CPU for each container process so they never execute on physical host cores' },
      { id: 'b', text: 'It translates Linux process calls into hypervisor interrupts' },
      { id: 'c', text: 'It virtualizes the process ID tree so the entrypoint process sees itself as PID 1 inside the container, while the host sees it as an unprivileged, higher PID number' },
      { id: 'd', text: 'It encrypts the host process table so containers cannot inspect /proc via memory pointers' },
    ],
    correctOptionId: 'c',
    explanation: 'The Linux PID namespace (CLONE_NEWPID) isolates the process ID space. A process running as PID 1 inside the container namespace has its own nested process tree, but on the host system, the Linux kernel maps it to a standard, non-PID-1 host process ID.',
    conceptTag: 'linux-namespaces-pid',
  },
  {
    id: 'q-devops-docker-19',
    difficulty: 'medium',
    question: 'Which Linux namespace provides isolated IP addresses, routing tables, port bindings, and firewall iptables rules for a container?',
    options: [
      { id: 'a', text: 'MNT (Mount) namespace' },
      { id: 'b', text: 'NET (Network) namespace' },
      { id: 'c', text: 'IPC (Inter-Process Communication) namespace' },
      { id: 'd', text: 'UTS (UNIX Timesharing System) namespace' },
    ],
    correctOptionId: 'b',
    explanation: 'The Network namespace (CLONE_NEWNET) virtualizes the network stack, providing independent network devices, IPv4/IPv6 protocol stacks, IP routing tables, firewall rules, port binding spaces (/proc/net), and socket lists.',
    conceptTag: 'linux-namespaces-net',
  },
  {
    id: 'q-devops-docker-20',
    difficulty: 'medium',
    question: 'Why does container initialization in modern runtimes (runc) use pivot_root instead of chroot when setting up the Mount (mnt) namespace?',
    options: [
      { id: 'a', text: 'chroot does not support ext4 filesystems' },
      { id: 'b', text: 'chroot requires rootless user namespaces which are disabled on modern Linux' },
      { id: 'c', text: 'pivot_root compiles container binaries into C-structures in memory' },
      { id: 'd', text: 'chroot only changes the root path lookup for the current process and can be broken out of with fchdir(..) vulnerabilities, whereas pivot_root unmounts and detaches the host root filesystem entirely' },
    ],
    correctOptionId: 'd',
    explanation: 'chroot only changes the conceptual root directory for path resolution. A process with root permissions can easily escape a chroot jail (e.g., using open file descriptors pointing outside the chroot and fchdir). pivot_root swaps the root mount point with a new root, allowing the previous host root to be unmounted and inaccessible.',
    conceptTag: 'linux-namespaces-pivot-root',
  },
  {
    id: 'q-devops-docker-21',
    difficulty: 'medium',
    question: 'What is the specific isolation responsibility of the Linux UTS namespace in container runtimes?',
    options: [
      { id: 'a', text: 'Isolating the POSIX shared memory queues and semaphores' },
      { id: 'b', text: 'Isolating system hostname and NIS domain name so containers can define their own hostnames without mutating the host OS hostname' },
      { id: 'c', text: 'Synchronizing container system clocks to UTC via hardware RTC' },
      { id: 'd', text: 'Tracking microsecond CPU execution cycles for cgroup throttling' },
    ],
    correctOptionId: 'b',
    explanation: 'The UTS (UNIX Timesharing System) namespace (CLONE_NEWUTS) allows a container to have its own hostname and NIS domain name. Modifying the hostname via sethostname() inside the UTS namespace does not alter the host machine hostname.',
    conceptTag: 'linux-namespaces-uts',
  },
  {
    id: 'q-devops-docker-22',
    difficulty: 'medium',
    question: 'How do Linux User Namespaces (CLONE_NEWUSER) enhance container security when enabled in Docker daemon configuration?',
    options: [
      { id: 'a', text: 'They prevent all users from creating Docker containers unless authorized by LDAP' },
      { id: 'b', text: 'They disable the su and sudo commands completely inside all containers' },
      { id: 'c', text: 'They encrypt home directories of container users using Linux LUKS' },
      { id: 'd', text: 'They map UID 0 (root) inside the container to an unprivileged high UID (e.g., UID 100000) on the host, preventing host root escalation if a container breakout occurs' },
    ],
    correctOptionId: 'd',
    explanation: 'User namespaces map container UIDs and GIDs to different host UIDs and GIDs. The process inside the container believes it is running as UID 0 (root) with full container capabilities, but the host kernel treats all operations as originating from an unprivileged host UID (e.g., UID 100000), mitigating host compromise risks.',
    conceptTag: 'linux-namespaces-user',
  },
  {
    id: 'q-devops-docker-23',
    difficulty: 'medium',
    question: 'What architectural advantage does cgroups v2 (unified hierarchy) have over cgroups v1 in modern Linux distributions and container engines?',
    options: [
      { id: 'a', text: 'cgroups v2 provides a single unified hierarchy tree, preventing conflicting resource accounting and properly tracking buffered I/O writeback under memory pressure' },
      { id: 'b', text: 'cgroups v2 eliminates the need for Linux namespaces entirely' },
      { id: 'c', text: 'cgroups v2 allows containers to exceed host physical memory by swapping to AWS S3' },
      { id: 'd', text: 'cgroups v2 runs entirely in userspace via eBPF bytecode' },
    ],
    correctOptionId: 'a',
    explanation: 'In cgroups v1, controllers (cpu, memory, blkio) operated in separate orthogonal hierarchies, making it impossible to attribute buffered I/O writebacks to the responsible memory cgroup. cgroups v2 unifies all controllers into a single hierarchy, enabling precise cross-resource attribution and pressure stall information (PSI).',
    conceptTag: 'cgroups-v1-vs-v2',
  },
  {
    id: 'q-devops-docker-24',
    difficulty: 'medium',
    question: 'How does the Linux Completely Fair Scheduler (CFS) enforce a container CPU limit specified as --cpus=1.5 in Docker?',
    options: [
      { id: 'a', text: 'It pins the container process to core 1 and allows 50% hyperthreading on core 2' },
      { id: 'b', text: 'It reduces the CPU clock frequency of cores running container tasks' },
      { id: 'c', text: 'It sets cpu.cfs_period_us to 100,000 microseconds (100ms) and cpu.cfs_quota_us to 150,000 microseconds (150ms) per tracking period' },
      { id: 'd', text: 'It drops every 3rd CPU instruction generated by the container' },
    ],
    correctOptionId: 'c',
    explanation: 'CFS bandwidth control defines a tracking window (cpu.cfs_period_us, default 100ms) and an allowed runtime quota (cpu.cfs_quota_us). For 1.5 CPUs, quota is 1.5 * 100,000 = 150,000 microseconds. If the container consumes this quota before the 100ms period ends, its threads are throttled until the next period begins.',
    conceptTag: 'cgroups-cpu-cfs-throttling',
  },
  {
    id: 'q-devops-docker-25',
    difficulty: 'medium',
    question: 'In cgroups v2, what is the difference between setting memory.high vs setting memory.max for a container?',
    options: [
      { id: 'a', text: 'memory.high sets the swap limit, while memory.max sets physical RAM' },
      { id: 'b', text: 'memory.high is measured in megabytes, while memory.max is measured in page numbers' },
      { id: 'c', text: 'memory.high applies to kernel buffer pages, while memory.max applies to userspace anonymous memory' },
      { id: 'd', text: 'Exceeding memory.high applies proportional reclaim pressure and throttles process execution without killing it; exceeding memory.max triggers the Out-Of-Memory (OOM) killer immediately' },
    ],
    correctOptionId: 'd',
    explanation: 'cgroups v2 introduces memory.high as a soft throttling threshold. When exceeded, the kernel aggressively reclaims page cache and throttles the processes allocations. In contrast, memory.max is a hard ceiling: if exceeded and memory cannot be reclaimed, the OOM killer terminates a process.',
    conceptTag: 'cgroups-v2-memory-limits',
  },
  {
    id: 'q-devops-docker-26',
    difficulty: 'medium',
    question: 'How does the standard Docker bridge network (docker0) route traffic between a container and the external public Internet?',
    options: [
      { id: 'a', text: 'Through a virtual ethernet (veth) pair connected to bridge docker0, with host iptables applying SNAT (MASQUERADE) to outbound packets' },
      { id: 'b', text: 'Via an encrypted WireGuard tunnel automatically established to Docker Hub' },
      { id: 'c', text: 'By passing packets directly through host raw hardware DMA registers' },
      { id: 'd', text: 'Using BGP peering between the container net namespace and the upstream router' },
    ],
    correctOptionId: 'a',
    explanation: 'A virtual ethernet pair (veth) connects the container network namespace to the host bridge (docker0). For outbound traffic to external networks, the Linux kernel forwards packets across the bridge and uses iptables MASQUERADE rules to perform Source Network Address Translation (SNAT) using the host IP.',
    conceptTag: 'docker-networking-bridge',
  },
  {
    id: 'q-devops-docker-27',
    difficulty: 'medium',
    question: 'What is the primary operational trade-off of running a container with --net=host mode?',
    options: [
      { id: 'a', text: 'It completely disables all container file write access to /tmp' },
      { id: 'b', text: 'It forces the container to run as the host root user' },
      { id: 'c', text: 'It provides maximum network throughput with zero NAT overhead, but eliminates network isolation and exposes host ports directly to collisions' },
      { id: 'd', text: 'It prevents the container from establishing outbound HTTPS connections' },
    ],
    correctOptionId: 'c',
    explanation: 'In --net=host mode, the container shares the host network namespace directly: no veth pair, no bridge, no iptables NAT. This delivers native performance with zero latency overhead, but the container shares the host IP and port space, risking port collisions and breaking network isolation.',
    conceptTag: 'docker-networking-host',
  },
  {
    id: 'q-devops-docker-28',
    difficulty: 'medium',
    question: 'How does the --net=container:<target_container_name_or_id> network mode operate in Docker?',
    options: [
      { id: 'a', text: 'It creates an encrypted overlay network between two physical host machines' },
      { id: 'b', text: 'It attaches the new container directly into the existing network namespace of the target container, allowing them to communicate via localhost (127.0.0.1)' },
      { id: 'c', text: 'It copies all iptables rules from the target container into a newly allocated bridge' },
      { id: 'd', text: 'It load-balances traffic 50/50 across both containers using round-robin DNS' },
    ],
    correctOptionId: 'b',
    explanation: 'The --net=container:<id> mode joins the existing network namespace of another container. Both containers share the same IP address, MAC address, and port space, allowing them to communicate over localhost. This is the underlying mechanism used by Kubernetes Pods to group multiple containers.',
    conceptTag: 'docker-networking-container-mode',
  },
  {
    id: 'q-devops-docker-29',
    difficulty: 'medium',
    question: 'What subtle issue can occur when running multithreaded Go or C++ applications on Alpine Linux base images instead of Debian-Slim?',
    options: [
      { id: 'a', text: 'Alpine Linux does not support TCP sockets' },
      { id: 'b', text: 'musl libc forces all CPU instructions to execute sequentially on a single core' },
      { id: 'c', text: 'Alpine uses musl libc instead of glibc, which has differences in DNS resolution (no search domain concurrency) and thread stack allocation sizes that can cause segmentation faults or latency' },
      { id: 'd', text: 'Alpine Linux kernel images cannot be loaded into Docker Engine 24+' },
    ],
    correctOptionId: 'c',
    explanation: 'Alpine Linux uses musl libc instead of GNU C Library (glibc). musl has a smaller default thread stack size (causing stack overflow in deep call stacks), handles parallel DNS resolution differently, and lacks optimized malloc implementations, causing subtle bugs or performance regressions for glibc-targeted applications.',
    conceptTag: 'docker-base-images-alpine-vs-debian',
  },
  {
    id: 'q-devops-docker-30',
    difficulty: 'medium',
    question: 'Why does Google Distroless provide a superior security profile compared to standard minimal base images like Ubuntu or Alpine?',
    options: [
      { id: 'a', text: 'Distroless images contain only the application and its direct runtime dependencies, omitting package managers, shells (sh/bash), and coreutils, severely hindering attackers seeking shell access' },
      { id: 'b', text: 'Distroless images include an AI-based intrusion detection engine compiled into the kernel' },
      { id: 'c', text: 'Distroless images run exclusively in CPU hardware rings 0 and 1' },
      { id: 'd', text: 'Distroless images automatically revoke all outbound networking after 60 seconds' },
    ],
    correctOptionId: 'a',
    explanation: 'Google Distroless images strip everything except the runtime language and minimal libraries. There is no shell (no /bin/sh or /bin/bash), no package manager (no apt, apk), and no text editors or download utilities (curl, wget). If an attacker finds a Remote Code Execution (RCE) flaw, they cannot spawn a reverse shell or download exploits easily.',
    conceptTag: 'docker-distroless-security',
  },
  {
    id: 'q-devops-docker-31',
    difficulty: 'medium',
    question: 'How does Docker BuildKit cache mounts (RUN --mount=type=cache) speed up language package managers without bloating the final image?',
    codeSnippet: `# syntax=docker/dockerfile:1
FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN --mount=type=cache,target=/root/.cache/go-build \\
    go build -o /bin/api .`,
    options: [
      { id: 'a', text: 'It uploads the build directory to an external S3 bucket before compiling' },
      { id: 'b', text: 'It bypasses the Go type checker to speed up compilation' },
      { id: 'c', text: 'It turns the Go compiler into a multithreaded daemon running on the host OS' },
      { id: 'd', text: 'It mounts an engine-managed cache directory to /root/.cache/go-build during the RUN execution that persists across builds but is NOT committed into the resulting image layer' },
    ],
    correctOptionId: 'd',
    explanation: 'BuildKit cache mounts (--mount=type=cache) attach a persistent directory managed by BuildKit during build execution. Compiler artifacts (like Go build cache or ~/.npm) survive across Docker builds, but the cache directory is unmounted before the layer snapshot is taken, keeping the image small.',
    conceptTag: 'docker-buildkit-cache-mounts',
  },
  {
    id: 'q-devops-docker-32',
    difficulty: 'medium',
    question: 'Why should private npm tokens or SSH keys be mounted using RUN --mount=type=secret instead of being passed via ARG in a Dockerfile?',
    codeSnippet: `# Insecure:
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc && npm install

# Secure:
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm install`,
    options: [
      { id: 'a', text: 'ARG values are encrypted, but npm install cannot read encrypted strings' },
      { id: 'b', text: 'ARG values are baked into the unencrypted metadata of the image layers and can be retrieved by anyone with docker history or docker inspect' },
      { id: 'c', text: 'Docker BuildKit crashes if ARG strings exceed 16 characters' },
      { id: 'd', text: 'Secret mounts are required by POSIX standards for file paths starting with a dot' },
    ],
    correctOptionId: 'b',
    explanation: 'ARG values are permanently visible in the image history, manifest metadata, and layer diffs. Using BuildKit secret mounts (--mount=type=secret) mounts the secret as a transient file in memory (tmpfs) during the RUN execution without persisting it into any image layer or metadata.',
    conceptTag: 'docker-buildkit-secret-mounts',
  },
  {
    id: 'q-devops-docker-33',
    difficulty: 'medium',
    question: 'What is a "dangling" image in Docker, and how does it differ from an unused image?',
    options: [
      { id: 'a', text: 'A dangling image has tag <none>:<none> because a newly built image took over its repository:tag name; an unused image has a valid tag but is not referenced by any container' },
      { id: 'b', text: 'A dangling image is an image running without a valid TLS certificate' },
      { id: 'c', text: 'A dangling image is an image hosted on an unauthenticated private registry' },
      { id: 'd', text: 'A dangling image is an image whose base image was deleted from Docker Hub' },
    ],
    correctOptionId: 'a',
    explanation: 'A dangling image is an image layer that is no longer tagged (shows as <none>:<none>), typically because a new build reused the same tag (untagging the old image). An unused image is properly tagged but no running or stopped container currently uses it.',
    conceptTag: 'docker-dangling-vs-unused-images',
  },
  {
    id: 'q-devops-docker-34',
    difficulty: 'medium',
    question: 'A container running as non-root user (USER 10001) fails with "Permission denied" when attempting to write to a host bind-mounted volume (-v /host/data:/data). What is the root cause?',
    options: [
      { id: 'a', text: 'Docker bind mounts do not support non-root users on any Linux system' },
      { id: 'b', text: 'The container network namespace is blocking filesystem syscalls' },
      { id: 'c', text: 'The directory /host/data on the host filesystem is owned by UID 0 (root) or a user other than UID 10001, and file permissions prevent write access by other users' },
      { id: 'd', text: 'Docker automatically converts all bind mounts to read-only for non-root users' },
    ],
    correctOptionId: 'c',
    explanation: 'Docker bind mounts expose the host directory permissions directly to the container. Since Linux file access is governed by numerical UIDs/GIDs rather than usernames, if /host/data is owned by host UID 1000 with permissions 755, container UID 10001 has only read access unless host permissions are modified (e.g., chown 10001:10001 or chmod 777).',
    conceptTag: 'docker-bind-mount-uid-permissions',
  },

  // ============================================================================
  // HARD / ADVANCED (Questions 35 - 50)
  // ============================================================================
  {
    id: 'q-devops-docker-35',
    difficulty: 'hard',
    question: 'According to the OCI (Open Container Initiative) Image Specification, what is the architectural relationship between Diff IDs and Layer Digests?',
    options: [
      { id: 'a', text: 'Diff IDs and Layer Digests are identical SHA-256 hashes of the compressed tar.gz files' },
      { id: 'b', text: 'Layer Digests are SHA-256 hashes of the compressed archives (tar.gz) used during distribution/network transfer; Diff IDs are SHA-256 hashes of the uncompressed tar archives referenced in the image configuration blob' },
      { id: 'c', text: 'Diff IDs represent the Git commit SHA, while Layer Digests represent the container process ID' },
      { id: 'd', text: 'Layer Digests are generated by the container registry, while Diff IDs are generated by the Linux kernel cgroup subsystem' },
    ],
    correctOptionId: 'b',
    explanation: 'In the OCI Image Spec, Layer Digests in the manifest are SHA-256 hashes of the compressed tarballs (mediaType ...tar+gzip) transferred over the wire. Diff IDs in the Image Configuration (rootfs.diff_ids) are SHA-256 hashes of the uncompressed tar archives after extraction, ensuring reproducibility regardless of compression algorithm.',
    conceptTag: 'oci-spec-diff-ids-vs-digests',
  },
  {
    id: 'q-devops-docker-36',
    difficulty: 'hard',
    question: 'In the Linux overlay2 storage driver, how do the lowerdir, upperdir, merged, and workdir directories interact when a container runs?',
    options: [
      { id: 'a', text: 'lowerdir is the read-write layer; upperdir stores deleted files; merged is the swap space' },
      { id: 'b', text: 'workdir stores kernel modules, while lowerdir and upperdir are loopback block devices' },
      { id: 'c', text: 'upperdir is stored in RAM; lowerdir is stored on NVMe; merged is the network cache' },
      { id: 'd', text: 'lowerdir holds the read-only base image layers; upperdir holds the container writable changes; workdir is an internal staging area for atomic operations; merged is the unified mount point visible to the container' },
    ],
    correctOptionId: 'd',
    explanation: 'Overlay2 combines directories into a unified mount: lowerdir contains stacked read-only image layers (colon-separated); upperdir records container runtime writes, modifications, and creations; workdir is used by the kernel to prepare atomic file operations before moving them to upperdir; merged is the mount target where the combined filesystem appears to processes.',
    conceptTag: 'overlay2-filesystem-internals',
  },
  {
    id: 'q-devops-docker-37',
    difficulty: 'hard',
    question: 'A database process running in a container attempts to modify a single byte in a 10GB data file that exists in an image layer (lowerdir). What performance penalty occurs under the overlay2 storage driver?',
    options: [
      { id: 'a', text: 'Zero penalty: overlay2 uses block-level copy-on-write so only a 4KB disk block is copied' },
      { id: 'b', text: 'Severe latency spike: overlay2 operates at the file level, forcing the Linux kernel to copy the entire 10GB file from lowerdir up to upperdir before executing the write' },
      { id: 'c', text: 'The kernel throws an EROFS (Read-only filesystem) error because image files cannot be modified' },
      { id: 'd', text: 'The container crashes with an Out-of-Memory exception due to cgroup page allocation limits' },
    ],
    correctOptionId: 'b',
    explanation: 'Unlike block-level filesystems (such as ZFS or Btrfs), OverlayFS is a file-level union filesystem. When a file residing in lowerdir is opened for writing (O_WRONLY or O_RDWR), the kernel performs a copy-up operation: the entire file is copied from lowerdir into upperdir before the write proceeds. For large files, this incurs massive latency and I/O overhead; hence database data must reside in Docker volumes.',
    conceptTag: 'overlay2-copy-on-write-overhead',
  },
  {
    id: 'q-devops-docker-38',
    difficulty: 'hard',
    question: 'How does overlay2 handle the deletion of a file inside a container that originally existed in a read-only lowerdir layer?',
    options: [
      { id: 'a', text: 'It deletes the underlying inodes directly from the lowerdir storage volume' },
      { id: 'b', text: 'It writes a tombstone entry into /etc/fstab inside the container' },
      { id: 'c', text: 'It marks the file with a POSIX sticky bit that tells the kernel to hide it' },
      { id: 'd', text: 'It creates a character device file with major/minor numbers 0/0 (a whiteout file) in the upperdir with the exact name of the deleted file' },
    ],
    correctOptionId: 'd',
    explanation: 'Because lowerdir is strictly read-only, overlay2 cannot modify it. To delete an inherited file, OverlayFS creates a "whiteout" file in upperdir. A whiteout is a character device with device numbers 0/0. When OverlayFS renders merged, any whiteout entry in upperdir masks the corresponding file from lowerdir.',
    conceptTag: 'overlay2-whiteouts-opaque-dirs',
  },
  {
    id: 'q-devops-docker-39',
    difficulty: 'hard',
    question: 'Why does running a Node.js or Python application directly as PID 1 in a container frequently lead to accumulated "zombie" (defunct) processes?',
    options: [
      { id: 'a', text: 'In Linux, when child processes terminate, their exit status remains in the process table until their parent calls waitpid(); if child processes are orphaned and reparented to PID 1, standard runtimes like Node.js do not implement a SIGCHLD reaper loop' },
      { id: 'b', text: 'Node.js and Python explicitly disable the Linux kernel fork() syscall' },
      { id: 'c', text: 'The Linux kernel automatically turns processes into zombies after 30 seconds of inactivity' },
      { id: 'd', text: 'Containers lack a swap partition, which causes finished processes to freeze in RAM' },
    ],
    correctOptionId: 'a',
    explanation: 'When a process terminates in Linux, its entry remains in the process table until its parent reads its exit code via waitpid(). If a parent dies, its children are reparented to PID 1. Standard application runtimes (Node, Python, Java) are not designed as init systems and do not reap re-parented zombie children, exhausting host PID table limits over time.',
    conceptTag: 'pid1-zombie-reaping',
  },
  {
    id: 'q-devops-docker-40',
    difficulty: 'hard',
    question: 'Why does a container running CMD ["node", "app.js"] ignore SIGTERM signals and wait the full 10-second timeout before being killed with SIGKILL by Docker during docker stop?',
    options: [
      { id: 'a', text: 'Docker stop always waits 10 seconds by default regardless of application signal handlers' },
      { id: 'b', text: 'Node.js blocks all signals on Linux when running in 64-bit mode' },
      { id: 'c', text: 'In Linux, PID 1 does not receive default signal handlers (like termination on SIGTERM); unless the application explicitly installs a handler for SIGTERM, the kernel drops the signal entirely' },
      { id: 'd', text: 'SIGTERM can only be delivered across network namespaces, not process namespaces' },
    ],
    correctOptionId: 'c',
    explanation: 'Under Linux kernel semantics, PID 1 has special protection: signals with default actions (such as termination on SIGTERM or SIGINT) are not applied automatically to PID 1 unless the process has explicitly installed a signal handler. If Node.js has no process.on("SIGTERM", ...), the kernel drops the signal, forcing Docker to issue an uncatchable SIGKILL after the 10-second grace period.',
    conceptTag: 'pid1-signal-handling-tini',
  },
  {
    id: 'q-devops-docker-41',
    difficulty: 'hard',
    question: 'How do init wrappers like tini or dumb-init (or the docker run --init flag) solve both zombie reaping and signal forwarding in containers?',
    options: [
      { id: 'a', text: 'They compile the application binary into a native systemd unit file at runtime' },
      { id: 'b', text: 'They intercept Docker daemon API calls via a UNIX domain socket proxy' },
      { id: 'c', text: 'They eliminate the need for the Linux PID namespace completely' },
      { id: 'd', text: 'They run as PID 1, register a SIGCHLD handler to continuously reap orphaned zombies via waitpid(), and forward incoming signals (SIGTERM, SIGINT) to the application child process group' },
    ],
    correctOptionId: 'd',
    explanation: 'Init utilities like tini act as lightweight init processes. Running as PID 1, tini forwards all incoming signals (SIGTERM, SIGINT, SIGHUP) to its child processes and spawns a loop listening for SIGCHLD to immediately call waitpid(-1, &status, WNOHANG), preventing both signal dropping and zombie process accumulation.',
    conceptTag: 'docker-init-wrappers',
  },
  {
    id: 'q-devops-docker-42',
    difficulty: 'hard',
    question: 'When building multi-architecture Docker images with buildx on an x86_64 host targeting linux/arm64, why is native cross-compilation vastly faster than QEMU emulation?',
    codeSnippet: `# Approach 1 (QEMU Emulation):
FROM --platform=$TARGETPLATFORM golang:1.22
RUN go build -o /bin/app main.go

# Approach 2 (Native Cross-Compilation):
FROM --platform=$BUILDPLATFORM golang:1.22 AS builder
ARG TARGETOS TARGETARCH
RUN GOOS=$TARGETOS GOARCH=$TARGETARCH go build -o /bin/app main.go`,
    options: [
      { id: 'a', text: 'QEMU translates every ARM64 CPU instruction into x86_64 instructions dynamically via user-mode emulation, introducing severe 10x-20x CPU overhead, whereas Go native cross-compilation executes the compiler natively on host x86_64 hardware' },
      { id: 'b', text: 'QEMU requires an active Internet connection to download ARM microcode during compilation' },
      { id: 'c', text: 'Approach 2 bypasses Docker layer caching entirely' },
      { id: 'd', text: 'ARM64 processors do not support static binary compilation' },
    ],
    correctOptionId: 'a',
    explanation: 'QEMU user-mode emulation (binfmt_misc) simulates target architecture instructions in software, which is CPU-intensive and can be 10x to 30x slower. Go and Rust can cross-compile natively: by running the compiler on the host architecture ($BUILDPLATFORM) and outputting binaries for $TARGETARCH, the build runs at full native host speed.',
    conceptTag: 'docker-multiarch-qemu-vs-crosscompile',
  },
  {
    id: 'q-devops-docker-43',
    difficulty: 'hard',
    question: 'What data structure does an OCI Image Index (manifest list) use to allow docker pull my-repo/my-app:v1 to fetch the correct architecture image automatically?',
    options: [
      { id: 'a', text: 'A DNS TXT record that points to different IP addresses based on client GeoIP' },
      { id: 'b', text: 'A single binary tarball containing concatenated x86 and ARM ELF executables' },
      { id: 'c', text: 'A JSON document containing an array of manifests, each pairing a mediaType and digest with a platform object specifying architecture (amd64, arm64) and os (linux)' },
      { id: 'd', text: 'An eBPF filter executed by the Docker registry on every HTTP request' },
    ],
    correctOptionId: 'c',
    explanation: 'An OCI Image Index (mediaType: application/vnd.oci.image.index.v1+json) contains a manifests array. Each entry points to an image manifest digest and declares its target platform (e.g., os: "linux", architecture: "arm64", variant: "v8"). The client inspects the index and fetches only the manifest matching its local kernel architecture.',
    conceptTag: 'oci-image-index-manifest-list',
  },
  {
    id: 'q-devops-docker-44',
    difficulty: 'hard',
    question: 'In Rootless Docker, how does RootlessKit allow an unprivileged user (UID 1000) to create network and mount namespaces without root permissions?',
    options: [
      { id: 'a', text: 'It uses a setuid-root binary that temporarily escalates user permissions' },
      { id: 'b', text: 'It leverages unprivileged Linux User Namespaces (CLONE_NEWUSER) and /etc/subuid mappings to create new PID, mount, and net namespaces where the user has UID 0 privileges inside the user namespace' },
      { id: 'c', text: 'It runs the Docker daemon inside a QEMU virtual machine in RAM' },
      { id: 'd', text: 'It modifies the host Linux kernel at boot time via DKMS' },
    ],
    correctOptionId: 'b',
    explanation: 'RootlessKit starts by unsharing the user namespace (CLONE_NEWUSER). Inside this new user namespace, the calling user becomes root (UID 0) and gains the necessary capabilities (CAP_NEWNS, CAP_SYS_ADMIN within that namespace) to create mount, network, and PID namespaces without requiring root on the host machine.',
    conceptTag: 'rootless-docker-architecture',
  },
  {
    id: 'q-devops-docker-45',
    difficulty: 'hard',
    question: 'What network mechanism does Rootless Docker use to allow container outbound Internet access without host iptables manipulation privileges?',
    options: [
      { id: 'a', text: 'Direct raw packet injection via AF_PACKET sockets' },
      { id: 'b', text: 'ICMP tunnel routing through Google Public DNS (8.8.8.8)' },
      { id: 'c', text: 'A userspace network stack such as slirp4netns or pasta connected to a TAP device inside the container network namespace' },
      { id: 'd', text: 'Automatic provisioning of an external AWS VPC NAT Gateway' },
    ],
    correctOptionId: 'c',
    explanation: 'Because an unprivileged user cannot modify host iptables or configure kernel bridge devices, Rootless Docker utilizes slirp4netns or pasta. These tools implement an entire TCP/IP stack in userspace, translating container packets into standard unprivileged userspace POSIX socket calls on the host.',
    conceptTag: 'rootless-docker-slirp4netns',
  },
  {
    id: 'q-devops-docker-46',
    difficulty: 'hard',
    question: 'How does Docker default Seccomp (Secure Computing Mode) profile protect the host Linux kernel from container breakout attacks?',
    options: [
      { id: 'a', text: 'It uses Berkeley Packet Filter (BPF) programs to intercept and block dangerous syscalls (such as clone with CLONE_NEWUSER, reboot, swapon, and keyctl) by returning EPERM' },
      { id: 'b', text: 'It encrypts all system call arguments using AES-GCM before passing them to the CPU' },
      { id: 'c', text: 'It replaces all C-standard library functions with safe Rust wrappers' },
      { id: 'd', text: 'It blocks any process that uses more than 4 threads from issuing I/O' },
    ],
    correctOptionId: 'a',
    explanation: 'Docker default seccomp profile whitelists ~300 of the 450+ Linux syscalls. Using seccomp-bpf, the kernel intercepts every syscall issued by container processes and immediately rejects blocked or hazardous calls (like keyctl, ptrace, reboot, add_key, kexec_load) with EPERM, preventing attackers from exploiting kernel driver flaws.',
    conceptTag: 'docker-seccomp-profiles',
  },
  {
    id: 'q-devops-docker-47',
    difficulty: 'hard',
    question: 'What principle of least privilege should be applied to Docker container Linux capabilities in high-security production environments?',
    options: [
      { id: 'a', text: 'Grant --cap-add=ALL and restrict access via sudo passwords' },
      { id: 'b', text: 'Linux capabilities are deprecated in favor of environment variables' },
      { id: 'c', text: 'Disable seccomp to allow capabilities to be dynamically renegotiated' },
      { id: 'd', text: 'Drop all capabilities using --cap-drop=ALL and selectively add only the specific required capability (e.g., --cap-add=NET_BIND_SERVICE for ports < 1024)' },
    ],
    correctOptionId: 'd',
    explanation: 'By default, Docker grants a subset of ~14 capabilities (like CHOWN, SETUID, KILL). In hardened environments, best practice is to drop all default capabilities with --cap-drop=ALL and re-add only what is strictly necessary (e.g., --cap-add=NET_BIND_SERVICE to bind port 80/443 without running as full root).',
    conceptTag: 'docker-linux-capabilities',
  },
  {
    id: 'q-devops-docker-48',
    difficulty: 'hard',
    question: 'How does an AppArmor or SELinux profile prevent a compromised container root process from tampering with host sensitive files like /proc/sys or /sys/firmware?',
    options: [
      { id: 'a', text: 'By removing /proc and /sys directories from the container image at build time' },
      { id: 'b', text: 'By enforcing Mandatory Access Control (MAC) policies in the kernel that restrict file path access and forbid mounting operations regardless of Linux UID 0 status' },
      { id: 'c', text: 'By scanning container memory every 5 seconds for malicious strings' },
      { id: 'd', text: 'By redirecting all file writes to a RAM disk that auto-destructs upon container exit' },
    ],
    correctOptionId: 'b',
    explanation: 'Linux Discretionary Access Control (DAC) trusts UID 0 (root). Mandatory Access Control (MAC) engines like AppArmor and SELinux enforce security labels independent of UID. The default docker-default AppArmor profile masks write operations to sensitive kernel interfaces (/proc/sysrq-trigger, /proc/kcore, /sys), blocking even root inside the container.',
    conceptTag: 'docker-apparmor-selinux-mac',
  },
  {
    id: 'q-devops-docker-49',
    difficulty: 'hard',
    question: 'In a distributed CI/CD pipeline using Docker Buildx, what is the difference between --cache-to=type=registry,mode=min vs mode=max?',
    codeSnippet: `docker buildx build \\
  --cache-to=type=registry,ref=myrepo/cache:app,mode=max \\
  --cache-from=type=registry,ref=myrepo/cache:app \\
  --push -t myrepo/app:latest .`,
    options: [
      { id: 'a', text: 'mode=min exports cache layers only for the final resulting stage, whereas mode=max exports cache layers for all intermediate stages including multi-stage builder stages' },
      { id: 'b', text: 'mode=min compresses layers using gzip, while mode=max compresses layers using Zstandard (zstd)' },
      { id: 'c', text: 'mode=max limits cache uploads to 10GB, while mode=min has no limit' },
      { id: 'd', text: 'mode=min caches only package manager files, while mode=max caches Git commit history' },
    ],
    correctOptionId: 'a',
    explanation: 'When pushing BuildKit cache to a remote registry, mode=min (the default) only caches layers that end up in the final exported image stage. For multi-stage builds, intermediate build stages (compilers, test runners) are discarded from the cache! Specifying mode=max ensures that all layers across every intermediate stage are cached to the registry.',
    conceptTag: 'docker-buildx-cache-registry-mode',
  },
  {
    id: 'q-devops-docker-50',
    difficulty: 'hard',
    question: 'Why is launching a container with --privileged considered a catastrophic security risk in production environments?',
    options: [
      { id: 'a', text: 'It doubles the billing rate on cloud container runtimes' },
      { id: 'b', text: 'It forces Docker to run in 32-bit compatibility mode' },
      { id: 'c', text: 'It disables all AppArmor and Seccomp filters, grants all Linux capabilities (including CAP_SYS_ADMIN), and exposes all host /dev hardware devices directly into the container, allowing trivial host takeover' },
      { id: 'd', text: 'It exposes all environment variables of the host machine to public DNS' },
    ],
    correctOptionId: 'c',
    explanation: 'The --privileged flag disables all security protections: it drops seccomp filters, disables AppArmor profiles, grants all Linux capabilities (including CAP_SYS_ADMIN, CAP_SYS_MODULE), and exposes all host device nodes (/dev/sda, etc.) to the container. A root process in a privileged container can mount the host root disk directly and achieve trivial host escape.',
    conceptTag: 'docker-security-privileged-flag-risks',
  },
];
