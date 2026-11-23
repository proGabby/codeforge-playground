import type { QuizQuestion } from '../../../../src/types';

export const ZERO_DOWNTIME_DEPLOYMENTS_50_QUESTIONS: QuizQuestion[] = [
  // ============================================================================
  // EASY / FOUNDATIONAL (Questions 1 - 17)
  // ============================================================================
  {
    id: 'q-devops-deploy-1',
    difficulty: 'easy',
    question: 'Why does setting spec.strategy.type: Recreate in a Kubernetes Deployment guarantee user-facing downtime during an update?',
    options: [
      { id: 'a', text: 'It reboots the physical worker nodes hosting the deployment' },
      { id: 'b', text: 'It terminates all existing pods simultaneously before any new pods are scheduled and become ready, leaving zero pods to serve traffic' },
      { id: 'c', text: 'It deletes the corresponding Kubernetes Service and Ingress objects' },
      { id: 'd', text: 'It forces CoreDNS to return NXDOMAIN for 5 minutes' },
    ],
    correctOptionId: 'b',
    explanation: 'The Recreate deployment strategy deletes all existing pod replicas before creating any new pods of the updated version. During the window between termination of old pods and readiness of new pods, no pods exist to serve requests, causing a service outage.',
    conceptTag: 'k8s-recreate-vs-rollingupdate',
  },
  {
    id: 'q-devops-deploy-2',
    difficulty: 'easy',
    question: 'In a Kubernetes RollingUpdate strategy, what does the maxSurge parameter specify?',
    options: [
      { id: 'a', text: 'The maximum network bandwidth permitted for image pulling' },
      { id: 'b', text: 'The maximum CPU spike allowed before the HorizontalPodAutoscaler triggers' },
      { id: 'c', text: 'The maximum number of seconds allowed for a rollout before automatic rollback' },
      { id: 'd', text: 'The maximum percentage or number of pods that can be created above the desired replica count during an update' },
    ],
    correctOptionId: 'd',
    explanation: 'maxSurge defines the maximum number (or percentage) of pod replicas that can be created over the desired replica count specified in spec.replicas during a rolling rollout. For example, with replicas: 4 and maxSurge: 1, up to 5 pods can exist simultaneously.',
    conceptTag: 'k8s-rollout-maxsurge',
  },
  {
    id: 'q-devops-deploy-3',
    difficulty: 'easy',
    question: 'What does the maxUnavailable parameter control during a Kubernetes RollingUpdate rollout?',
    options: [
      { id: 'a', text: 'The maximum number or percentage of pods that can be unavailable (unready or terminating) relative to the desired replica count' },
      { id: 'b', text: 'The number of failed HTTP requests permitted before triggering an alert' },
      { id: 'c', text: 'The maximum downtime permitted in seconds' },
      { id: 'd', text: 'The number of worker nodes that can be drained concurrently' },
    ],
    correctOptionId: 'a',
    explanation: 'maxUnavailable defines the maximum number or percentage of pods that can be unavailable during the update process. For instance, with replicas: 4 and maxUnavailable: 0, no old pods will be terminated until a new pod is fully running and ready.',
    conceptTag: 'k8s-rollout-maxunavailable',
  },
  {
    id: 'q-devops-deploy-4',
    difficulty: 'easy',
    question: 'A Kubernetes Deployment has replicas: 4, maxSurge: 25%, and maxUnavailable: 25%. How many total pods can exist, and how many must remain available during a rollout?',
    codeSnippet: `spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%`,
    options: [
      { id: 'a', text: 'Exactly 4 pods at all times, with 2 pods in terminating status' },
      { id: 'b', text: 'At most 8 total pods can exist, and 0 pods are required to be available' },
      { id: 'c', text: 'At most 5 total pods can exist (4 + 1), and at least 3 pods (4 - 1) must remain available' },
      { id: 'd', text: 'At most 6 total pods can exist, and at least 4 pods must remain available' },
    ],
    correctOptionId: 'c',
    explanation: '25% of 4 replicas is 1 pod. maxSurge: 1 means total pods can reach 4 + 1 = 5. maxUnavailable: 1 means at least 4 - 1 = 3 pods must be available and serving traffic at any given moment during the rollout.',
    conceptTag: 'k8s-rollout-calculations',
  },
  {
    id: 'q-devops-deploy-5',
    difficulty: 'easy',
    question: 'What is the fundamental difference between Continuous Delivery (CD) and Continuous Deployment?',
    options: [
      { id: 'a', text: 'Continuous Delivery requires Docker, while Continuous Deployment requires Kubernetes' },
      { id: 'b', text: 'In Continuous Delivery, every change that passes automated tests is automatically deployed to production without human intervention; in Continuous Deployment, deployment requires a manual approval gate' },
      { id: 'c', text: 'In Continuous Delivery, every change is validated and built so it is always ready to deploy, but production deployment requires manual approval; in Continuous Deployment, every passing build deploys automatically to production' },
      { id: 'd', text: 'Continuous Delivery only applies to front-end code' },
    ],
    correctOptionId: 'c',
    explanation: 'Continuous Delivery ensures every build is tested, packaged, and immediately deployable to production, but the final promotion step requires human approval (e.g. clicking a release button). Continuous Deployment removes the human gate: every commit that passes automated testing automatically deploys straight to production.',
    conceptTag: 'cicd-delivery-vs-deployment',
  },
  {
    id: 'q-devops-deploy-6',
    difficulty: 'easy',
    question: 'What is the correct logical order of standard stages in a robust CI/CD software delivery pipeline?',
    options: [
      { id: 'a', text: 'Deploy -> Lint -> Integration Test -> Unit Test -> Build Artifact' },
      { id: 'b', text: 'Lint & Static Analysis -> Unit Tests -> Build & Containerize -> Integration/Contract Tests -> Security/Vulnerability Scan -> Deploy' },
      { id: 'c', text: 'Build Container -> Deploy to Production -> Run Unit Tests -> Lint' },
      { id: 'd', text: 'Vulnerability Scan -> Deploy to Production -> Unit Tests -> Git Commit' },
    ],
    correctOptionId: 'b',
    explanation: 'Pipelines follow the "fail-fast" principle: cheapest and fastest checks first (Linting, AST checks, Unit tests), followed by artifact compilation and container building, heavier integration/contract tests, security vulnerability scanning (SAST/container scanning), and finally deployment.',
    conceptTag: 'cicd-pipeline-stages',
  },
  {
    id: 'q-devops-deploy-7',
    difficulty: 'easy',
    question: 'Which of the following is a core foundational pillar of the GitOps operational paradigm?',
    options: [
      { id: 'a', text: 'Developers apply configuration changes imperatively using kubectl apply from local laptops' },
      { id: 'b', text: 'Production clusters must disable all network firewalls' },
      { id: 'c', text: 'All production passwords must be committed in plaintext to Git README files' },
      { id: 'd', text: 'Git is the single source of truth for declaratively described infrastructure and application desired state, with automated controllers reconciling drift' },
    ],
    correctOptionId: 'd',
    explanation: 'GitOps dictates that: 1. The entire desired state is stored declaratively in Git; 2. State is version-controlled and immutable; 3. Changes are approved via Git PRs; 4. Software agents (ArgoCD, Flux) continuously reconcile the live cluster state with the desired state in Git.',
    conceptTag: 'gitops-core-principles',
  },
  {
    id: 'q-devops-deploy-8',
    difficulty: 'easy',
    question: 'How do you immediately initiate a rollback of a failed Kubernetes deployment to its previous revision using the CLI?',
    options: [
      { id: 'a', text: 'kubectl rollout undo deployment/my-app' },
      { id: 'b', text: 'kubectl delete deployment my-app' },
      { id: 'c', text: 'kubectl restart deployment/my-app --previous' },
      { id: 'd', text: 'kubectl rollback deployment/my-app' },
    ],
    correctOptionId: 'a',
    explanation: 'kubectl rollout undo deployment/<name> rolls back the deployment to its previous ReplicaSet revision. You can also specify an exact revision using --to-revision=<number>.',
    conceptTag: 'k8s-rollout-undo',
  },
  {
    id: 'q-devops-deploy-9',
    difficulty: 'easy',
    question: 'Why is using the container tag :latest in production Kubernetes manifests considered a dangerous anti-pattern?',
    options: [
      { id: 'a', text: 'Docker Hub charges double for images tagged as :latest' },
      { id: 'b', text: ':latest disables all container networking' },
      { id: 'c', text: 'The Linux kernel prohibits running images named :latest' },
      { id: 'd', text: ':latest is mutable and non-deterministic: you cannot know which code version is running, rollbacks cannot target a previous image tag, and nodes may run differing versions depending on imagePullPolicy' },
    ],
    correctOptionId: 'd',
    explanation: 'The :latest tag is an overwriteable pointer, not an immutable release artifact. If new code is pushed with :latest, different nodes in the same cluster may run different versions depending on when they pulled the image, and rolling back is impossible because the tag points to the broken build.',
    conceptTag: 'docker-tag-latest-anti-pattern',
  },
  {
    id: 'q-devops-deploy-10',
    difficulty: 'easy',
    question: 'What is the primary benefit of the "Build Once, Deploy Many" artifact immutability principle in enterprise CI/CD?',
    options: [
      { id: 'a', text: 'It avoids recompiling the application binary in each environment, guaranteeing that the exact byte-for-byte image tested in Staging is promoted to Production' },
      { id: 'b', text: 'It allows developers to share a single SSH key across all cloud providers' },
      { id: 'c', text: 'It eliminates the need for environment variables' },
      { id: 'd', text: 'It automatically minifies JavaScript files during deployment' },
    ],
    correctOptionId: 'a',
    explanation: 'Artifact immutability means building a single container image once in CI (tagged with a unique commit SHA or SemVer) and promoting that exact verified binary through Dev, Staging, and Production. Rebuilding per environment introduces environmental drift and subtle dependency discrepancies.',
    conceptTag: 'cicd-artifact-immutability',
  },
  {
    id: 'q-devops-deploy-11',
    difficulty: 'easy',
    question: 'How do Feature Flags (Feature Toggles) decouple software deployment from software release?',
    options: [
      { id: 'a', text: 'They compile the application into two separate ELF binaries' },
      { id: 'b', text: 'They allow containers to run without operating systems' },
      { id: 'c', text: 'They allow code to be deployed into production dark (dormant) and activated selectively for users via runtime configuration without triggering a new code build or pod deployment' },
      { id: 'd', text: 'They automatically resolve Git merge conflicts in pull requests' },
    ],
    correctOptionId: 'c',
    explanation: 'Deployment is the technical act of running code in production. Release is the business act of exposing features to end users. Feature flags enable code to deploy to production while remaining disabled, allowing progressive rollout, instant kill-switches, and dark launches without redeploying containers.',
    conceptTag: 'cicd-feature-flags',
  },
  {
    id: 'q-devops-deploy-12',
    difficulty: 'easy',
    question: 'What is the purpose of an automated Smoke Test stage executed immediately after deploying a new release into staging or production?',
    options: [
      { id: 'a', text: 'To perform exhaustive fuzzing and mutation testing of all edge cases' },
      { id: 'b', text: 'To run a lightweight suite of high-priority sanity tests verifying that fundamental endpoints and dependencies are responsive before opening traffic to all users' },
      { id: 'c', text: 'To generate synthetic load that stresses the database to 100% CPU' },
      { id: 'd', text: 'To delete old database backups' },
    ],
    correctOptionId: 'b',
    explanation: 'Smoke tests are fast, non-exhaustive checks (e.g. GET /healthz, login flow, rendering home page) run right after deployment to verify that the application bootstrapped, connected to databases, and can serve basic traffic before declaring the rollout successful.',
    conceptTag: 'cicd-smoke-testing',
  },
  {
    id: 'q-devops-deploy-13',
    difficulty: 'easy',
    question: 'According to Semantic Versioning (SemVer 2.0.0), when must the MAJOR version number be incremented?',
    options: [
      { id: 'a', text: 'When introducing backward-incompatible breaking API changes' },
      { id: 'b', text: 'When adding backward-compatible functionality' },
      { id: 'c', text: 'When making backward-compatible bug fixes' },
      { id: 'd', text: 'Whenever the application code exceeds 10,000 lines' },
    ],
    correctOptionId: 'a',
    explanation: 'Under SemVer (MAJOR.MINOR.PATCH): MAJOR is incremented for incompatible API breaking changes; MINOR is incremented for backward-compatible added functionality; PATCH is incremented for backward-compatible bug fixes.',
    conceptTag: 'cicd-semantic-versioning',
  },
  {
    id: 'q-devops-deploy-14',
    difficulty: 'easy',
    question: 'What is an "Ephemeral Preview Environment" in modern CI/CD pull request workflows?',
    options: [
      { id: 'a', text: 'A local Docker container running on the developer MacBook' },
      { id: 'b', text: 'A temporary, isolated cloud environment dynamically provisioned for a specific pull request and automatically destroyed when the PR is merged or closed' },
      { id: 'c', text: 'A staging cluster that runs only on weekends' },
      { id: 'd', text: 'A read-only mirror of the production database' },
    ],
    correctOptionId: 'b',
    explanation: 'Ephemeral preview environments spin up isolated copies of the application and dependencies per pull request. This allows product managers, designers, and QA engineers to test real running code before merging, and the environment is automatically cleaned up when the PR closes.',
    conceptTag: 'cicd-ephemeral-preview-environments',
  },
  {
    id: 'q-devops-deploy-15',
    difficulty: 'easy',
    question: 'Why should CI/CD pipelines never print decrypted secret values into standard build logs?',
    options: [
      { id: 'a', text: 'Printing secrets causes bash scripts to fail with exit code 1' },
      { id: 'b', text: 'Git automatically rejects commits if log outputs exceed 1MB' },
      { id: 'c', text: 'Plaintext strings cause buffer overflows in terminal emulators' },
      { id: 'd', text: 'Build logs are frequently indexed in centralized search tools (Elasticsearch, Datadog) and viewable by unauthorized team members or third-party auditors, leading to credential leakage' },
    ],
    correctOptionId: 'd',
    explanation: 'CI/CD logs are widely accessible across engineering teams and log management systems. Leaking secrets (API tokens, private keys, database passwords) into stdout/stderr permanently compromises credentials. Modern CI tools mask declared secrets automatically.',
    conceptTag: 'cicd-secrets-log-masking',
  },
  {
    id: 'q-devops-deploy-16',
    difficulty: 'easy',
    question: 'In a Kubernetes Deployment, what does minReadySeconds configure during a rolling rollout?',
    codeSnippet: `spec:
  minReadySeconds: 30
  strategy:
    type: RollingUpdate`,
    options: [
      { id: 'a', text: 'The time Kubernetes waits before starting the very first pod' },
      { id: 'b', text: 'The timeout for DNS resolution inside the pod' },
      { id: 'c', text: 'The minimum number of seconds a newly created pod must have its containers running and ready without crashing before Kubernetes considers it successfully ready and proceeds to update the next pod' },
      { id: 'd', text: 'The duration the pod remains in Terminating state' },
    ],
    correctOptionId: 'c',
    explanation: 'minReadySeconds dictates how long a new pod must stay in the Ready state without any container crashing before the Deployment controller marks it as available and moves on to the next pod in the rollout, preventing rollouts of pods that crash 5 seconds after starting.',
    conceptTag: 'k8s-min-ready-seconds',
  },
  {
    id: 'q-devops-deploy-17',
    difficulty: 'easy',
    question: 'What is the Twelve-Factor App principle regarding configuration management across deployment environments?',
    options: [
      { id: 'a', text: 'Bake environment-specific configuration directly into the source code repository' },
      { id: 'b', text: 'Store configuration in environment variables or externalized config services, keeping code and config strictly separated so the same image runs anywhere' },
      { id: 'c', text: 'Hardcode database passwords into JSON config files committed to Git' },
      { id: 'd', text: 'Deploy separate binary builds for each environment' },
    ],
    correctOptionId: 'b',
    explanation: 'Twelve-Factor App Factor III (Config) requires strict separation of config from code. Configuration that varies between deployments (credentials, database URLs, endpoints) must be injected via environment variables (or ConfigMaps/Secrets), allowing identical build artifacts to run in all environments.',
    conceptTag: 'twelve-factor-config-separation',
  },

  // ============================================================================
  // MEDIUM / INTERMEDIATE (Questions 18 - 34)
  // ============================================================================
  {
    id: 'q-devops-deploy-18',
    difficulty: 'medium',
    question: 'How does a Canary deployment differ fundamentally from a Blue/Green deployment in production traffic management?',
    options: [
      { id: 'a', text: 'Canary uses Docker; Blue/Green uses virtual machines' },
      { id: 'b', text: 'Blue/Green deployments only support relational databases' },
      { id: 'c', text: 'Canary deployments require complete cluster downtime during cutover' },
      { id: 'd', text: 'Blue/Green deploys a full replica set and switches 100% of traffic instantaneously from Blue to Green; Canary deploys the new version alongside the old and routes a small percentage of real traffic (e.g. 5%) to validate metrics before scaling' },
    ],
    correctOptionId: 'd',
    explanation: 'Blue/Green provisions a full parallel environment and cuts over all user traffic at once (via load balancer or DNS switch). Canary routes a small slice of traffic to the new version, observing error rates and latency on real users before progressively ramping up traffic (e.g. 5% -> 25% -> 100%).',
    conceptTag: 'canary-vs-blue-green',
  },
  {
    id: 'q-devops-deploy-19',
    difficulty: 'medium',
    question: 'In Argo Rollouts, how does the Rollout CRD configure an automated Canary strategy with step weights and pause durations?',
    codeSnippet: `apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: payment-service
spec:
  strategy:
    canary:
      steps:
      - setWeight: 10
      - pause: { duration: 10m }
      - setWeight: 50
      - pause: { duration: 30m }`,
    options: [
      { id: 'a', text: 'It shifts 10% of traffic to the new canary version, waits 10 minutes for automated analysis/observation, shifts 50% of traffic, waits 30 minutes, and then promotes to 100%' },
      { id: 'b', text: 'It pauses all cluster network traffic for 10 minutes before starting' },
      { id: 'c', text: 'It drops 10% of HTTP requests randomly' },
      { id: 'd', text: 'It limits pod CPU usage to 10% for 10 minutes' },
    ],
    correctOptionId: 'a',
    explanation: 'Argo Rollouts replaces the Deployment object with a Rollout CRD. The canary steps define the progressive rollout ladder: setWeight shifts traffic percentage (integrated with Ingress or Service Mesh like ALB, Istio, NGINX), and pause pauses rollout for observation or metrics evaluation.',
    conceptTag: 'argo-rollouts-canary-steps',
  },
  {
    id: 'q-devops-deploy-20',
    difficulty: 'medium',
    question: 'How does Flagger orchestrate progressive canary delivery with Kubernetes Ingress controllers or Service Meshes?',
    options: [
      { id: 'a', text: 'It modifies the Linux kernel routing table on each physical node via SSH' },
      { id: 'b', text: 'It replaces etcd with an in-memory Redis cluster' },
      { id: 'c', text: 'It generates primary and canary deployments, configures ingress/mesh traffic routing rules, queries Prometheus for metrics (e.g. error rate, latency), and advances or rolls back based on metric thresholds' },
      { id: 'd', text: 'It compiles TypeScript code into Envoy filter modules' },
    ],
    correctOptionId: 'c',
    explanation: 'Flagger automates canary promotion by managing two sets of deployments: primary (stable) and canary. It interfaces with Istio, Linkerd, Contour, or NGINX to adjust traffic splits while running Prometheus queries. If error rates exceed thresholds, Flagger automatically halts and rolls back.',
    conceptTag: 'flagger-progressive-delivery',
  },
  {
    id: 'q-devops-deploy-21',
    difficulty: 'medium',
    question: 'Why should helm upgrade always be run with the --atomic and --timeout flags in CI/CD deployment pipelines?',
    codeSnippet: `helm upgrade --install my-app ./charts/my-app \\
  --atomic \\
  --timeout 5m \\
  --values values.prod.yaml`,
    options: [
      { id: 'a', text: '--timeout 5m reboots the Kubernetes control plane if pods are slow to pull images' },
      { id: 'b', text: '--atomic forces Helm to bypass Kubernetes RBAC policies' },
      { id: 'c', text: 'Without --atomic, if any pod fails to become ready within the timeout, Helm leaves the release in a broken "FAILED" state with partially applied resources rather than automatically rolling back to the previous successful release' },
      { id: 'd', text: '--atomic is required to enable TLS encryption on Helm charts' },
    ],
    correctOptionId: 'c',
    explanation: 'By default, Helm marks a release as failed if resources fail to deploy, but leaves whatever was created in the cluster. Using --atomic tells Helm to wait for all resources to become ready (up to --timeout) and, if any resource fails, to automatically purge failed resources and roll back to the previous healthy revision.',
    conceptTag: 'helm-upgrade-atomic-rollback',
  },
  {
    id: 'q-devops-deploy-22',
    difficulty: 'medium',
    question: 'What is "configuration drift" in Helm releases, and why does standard helm upgrade fail to detect out-of-band manual changes made via kubectl edit?',
    options: [
      { id: 'a', text: 'Helm releases delete themselves after 30 days of inactivity' },
      { id: 'b', text: 'Helm computes release diffs against the last-applied Helm release Secret in the cluster, not against the live cluster object state, so manual edits to live resources may not be reconciled unless overwritten or using a 3-way merge tool' },
      { id: 'c', text: 'Helm only supports YAML files with fewer than 100 lines' },
      { id: 'd', text: 'Kubectl edit encrypts live resources so Helm cannot inspect them' },
    ],
    correctOptionId: 'b',
    explanation: 'Helm stores release history in cluster Secrets. In earlier versions and standard workflows, Helm compares the chart against the stored release manifest rather than the live state in etcd. If an operator manually modifies an environment variable or replica count via kubectl, Helm will not revert it unless GitOps controllers (like Flux Helm Controller) enforce live state reconciliation.',
    conceptTag: 'helm-drift-detection',
  },
  {
    id: 'q-devops-deploy-23',
    difficulty: 'medium',
    question: 'In zero-downtime database schema migrations, what is the three-phase "Expand and Contract" (Parallel Run) pattern?',
    options: [
      { id: 'a', text: 'Expand disk size, compress database tables, contract cloud compute instances' },
      { id: 'b', text: 'Duplicate the database cluster across two different cloud providers' },
      { id: 'c', text: 'Stop all web servers, run database migration scripts, restart web servers' },
      { id: 'd', text: 'Phase 1 (Expand): add new nullable/defaulted columns or tables, write code that writes to both old and new structures; Phase 2: asynchronously backfill historical data; Phase 3 (Contract): switch reads/writes fully to new structure and drop the old column/table' },
    ],
    correctOptionId: 'd',
    explanation: 'Directly altering or dropping columns breaks older running pods during rolling updates. The Expand and Contract pattern spans multiple releases: Expand adds the new schema alongside the old (dual-writing); backfill populates old data; Contract updates application code to read only new schema before safely dropping obsolete fields.',
    conceptTag: 'db-migration-expand-and-contract',
  },
  {
    id: 'q-devops-deploy-24',
    difficulty: 'medium',
    question: 'Why does executing ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) NOT NULL; in a relational database cause a severe outage during a rolling deployment?',
    options: [
      { id: 'a', text: 'Existing running pods of version 1 do not provide phone_number in their INSERT statements, causing all user creations to fail; additionally, in older RDBMS versions, adding NOT NULL without a default takes an exclusive table lock that blocks all queries' },
      { id: 'b', text: 'The SQL syntax is invalid in PostgreSQL and MySQL' },
      { id: 'c', text: 'VARCHAR columns consume all available server memory' },
      { id: 'd', text: 'PostgreSQL drops all foreign key indexes when new columns are created' },
    ],
    correctOptionId: 'a',
    explanation: 'Adding a NOT NULL column without a default value causes two severe failures: 1. In older DB engines, it locks the table exclusively while rewriting all rows, blocking traffic; 2. Old application pods still running during the rolling rollout do not know about the new column, so their INSERTs fail with constraint violation errors.',
    conceptTag: 'db-migration-not-null-lock-outage',
  },
  {
    id: 'q-devops-deploy-25',
    difficulty: 'medium',
    question: 'Why must column renames (e.g. renaming users.full_name to users.name) never be performed as a single atomic SQL RENAME statement in zero-downtime systems?',
    options: [
      { id: 'a', text: 'SQL RENAME statements are not supported in relational databases' },
      { id: 'b', text: 'The Linux kernel drops database connections during schema alters' },
      { id: 'c', text: 'Renaming columns corrupts database indexes irreversibly' },
      { id: 'd', text: 'During a rolling deployment, old and new application pods run concurrently: if the column is renamed, old pods crash trying to query full_name, while if not renamed, new pods crash trying to query name' },
    ],
    correctOptionId: 'd',
    explanation: 'During rolling updates, version N and version N+1 run side-by-side. Renaming the column immediately breaks one of the two versions. Zero-downtime renames require adding the new column, dual-writing, backfilling, switching reads, and only then dropping the old column in a later release.',
    conceptTag: 'db-migration-rename-hazard',
  },
  {
    id: 'q-devops-deploy-26',
    difficulty: 'medium',
    question: 'How do Kubernetes Readiness Gates (spec.readinessGates) coordinate with external Cloud Load Balancers (like AWS ALB or GCP NEG) during rolling updates?',
    options: [
      { id: 'a', text: 'They prevent Kubernetes from terminating an old pod until the external cloud load balancer has fully registered the new pod target, passed cloud target health checks, and begun routing traffic to it' },
      { id: 'b', text: 'They reboot the cloud load balancer when pods are scheduled' },
      { id: 'c', text: 'They automatically purchase additional AWS IP addresses' },
      { id: 'd', text: 'They compress HTTP payloads over gzip before reaching the pod' },
    ],
    correctOptionId: 'a',
    explanation: 'When using cloud load balancers with Pod IP targets (e.g. AWS ALB target groups or GKE Network Endpoint Groups), pod readiness in Kubernetes alone does not guarantee the cloud LB has registered the target. Readiness gates ensure the deployment waits until cloud target health checks pass before terminating old pods.',
    conceptTag: 'readiness-gates-cloud-lb-coordination',
  },
  {
    id: 'q-devops-deploy-27',
    difficulty: 'medium',
    question: 'What is "Connection Draining" (Deregistration Delay) in load balancers, and why is it essential for zero-downtime rollouts?',
    options: [
      { id: 'a', text: 'It terminates all active TCP connections immediately to save memory' },
      { id: 'b', text: 'It clears the browser DNS cache' },
      { id: 'c', text: 'When a backend target is deregistered, the load balancer stops sending new requests to it while allowing existing in-flight connections a configured grace period to complete normally before cutting the socket' },
      { id: 'd', text: 'It redirects all HTTP POST requests to an S3 bucket' },
    ],
    correctOptionId: 'c',
    explanation: 'Connection draining ensures that when an old pod or server is deregistered, the load balancer stops routing new requests to it but allows existing, in-flight transactions (e.g. long file uploads, payments, WebSocket sessions) to finish cleanly during a grace period (e.g. 30-60s).',
    conceptTag: 'load-balancer-connection-draining',
  },
  {
    id: 'q-devops-deploy-28',
    difficulty: 'medium',
    question: 'What is a "Dark Launch" in modern progressive deployment strategies?',
    options: [
      { id: 'a', text: 'Deploying software updates exclusively at midnight during off-peak hours' },
      { id: 'b', text: 'Releasing new backend functionality to production without exposing any user interface controls, testing performance and stability by shadowing real production traffic or processing background jobs' },
      { id: 'c', text: 'A deployment performed without running any unit tests' },
      { id: 'd', text: 'Disabling HTTPS encryption to test raw TCP latency' },
    ],
    correctOptionId: 'b',
    explanation: 'A dark launch deploys new backend components into production without exposing user-facing UI elements. Production traffic is duplicated/mirrored (shadowing) to the new code to evaluate resource usage, query performance, and accuracy against production volume without risking user impact.',
    conceptTag: 'dark-launching-patterns',
  },
  {
    id: 'q-devops-deploy-29',
    difficulty: 'medium',
    question: 'How does a StatefulSet rolling update with the partition parameter enable staged canary updates on stateful distributed systems?',
    codeSnippet: `spec:
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      partition: 2`,
    options: [
      { id: 'a', text: 'It updates only pods with ordinal index greater than or equal to the partition value, leaving lower-ordinal pods on the previous version' },
      { id: 'b', text: 'It partitions the hard drive into 2 RAID arrays before updating' },
      { id: 'c', text: 'It deploys the StatefulSet across exactly 2 cloud availability zones' },
      { id: 'd', text: 'It allows 2 replicas to crash before triggering a rollback' },
    ],
    correctOptionId: 'a',
    explanation: 'In a StatefulSet with replicas: 5 and partition: 2, only pods with ordinal index >= 2 (pods 2, 3, 4) will be updated when the spec is modified. Pods 0 and 1 remain untouched on the older version. This allows canary testing on stateful clusters before decrementing the partition to 0.',
    conceptTag: 'statefulset-partition-canary',
  },
  {
    id: 'q-devops-deploy-30',
    difficulty: 'medium',
    question: 'Why does Envoy dynamic configuration via xDS provide true zero-downtime configuration reloads compared to legacy NGINX process reload models?',
    options: [
      { id: 'a', text: 'Envoy runs inside the Linux kernel network stack' },
      { id: 'b', text: 'Envoy uses the dynamic discovery API (xDS) to update listeners, routes, and clusters in-memory via atomic pointer swaps without dropping TCP connections or restarting worker processes, whereas NGINX reload spawns new workers and terminates old ones' },
      { id: 'c', text: 'NGINX cannot route HTTP/2 traffic' },
      { id: 'd', text: 'Envoy replaces TCP with UDP for all connections' },
    ],
    correctOptionId: 'b',
    explanation: 'NGINX configuration reloads (nginx -s reload) spawn new worker processes and gracefully shut down old workers, which can drop long-lived WebSockets and transient TCP handshakes under heavy reload frequency. Envoy xDS receives updates over gRPC streams and applies route/cluster changes atomically in-memory with zero process recycling.',
    conceptTag: 'envoy-xds-zero-downtime-reloads',
  },
  {
    id: 'q-devops-deploy-31',
    difficulty: 'medium',
    question: 'How should CI/CD pipelines cache dependency directories (such as ~/.npm, ~/.cache/pip, or ~/.m2) safely across distributed ephemeral runner agents?',
    options: [
      { id: 'a', text: 'Commit dependency cache archives directly into the Git repository' },
      { id: 'b', text: 'Share a single NFS mount without file locking across all build agents' },
      { id: 'c', text: 'Never use caching because it violates the principle of immutability' },
      { id: 'd', text: 'Compute a cryptographic hash of lockfiles (e.g. package-lock.json, poetry.lock) to use as the cache key, restoring matching tarballs from object storage (S3/GCS) before build execution' },
    ],
    correctOptionId: 'd',
    explanation: 'Modern CI systems (GitHub Actions, GitLab CI) hash lockfiles as cache keys (e.g. cache-key: npm-\${{ hashFiles("**/package-lock.json") }}). If the lockfile matches, the cached dependency archive is downloaded from object storage, speeding up builds while invalidating automatically when dependencies change.',
    conceptTag: 'cicd-dependency-caching',
  },
  {
    id: 'q-devops-deploy-32',
    difficulty: 'medium',
    question: 'What is the purpose of Contract Testing (e.g. using Pact) between microservices in a continuous deployment pipeline?',
    options: [
      { id: 'a', text: 'To generate legal agreements between developers and cloud vendors' },
      { id: 'b', text: 'To test database transactions using ACID serializable isolation' },
      { id: 'c', text: 'To verify independently that API consumers and API providers conform to an agreed message schema without needing to deploy both services into an end-to-end integration test environment simultaneously' },
      { id: 'd', text: 'To scan third-party libraries for GPL license violations' },
    ],
    correctOptionId: 'c',
    explanation: 'Contract testing verifies interactions at the boundary between consumer and provider against shared contract definitions (pacts). This catches breaking API changes before deployment without the slow, fragile overhead of running full multi-service end-to-end environments.',
    conceptTag: 'contract-testing-microservices',
  },
  {
    id: 'q-devops-deploy-33',
    difficulty: 'medium',
    question: 'In GitHub Actions or GitLab CI, why should pipeline workflows pin third-party actions/tasks by immutable commit SHAs rather than mutable Git tags?',
    codeSnippet: `# Insecure:
- uses: actions/checkout@v4

# Secure:
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1`,
    options: [
      { id: 'a', text: 'Commit SHAs run 50% faster than Git tags' },
      { id: 'b', text: 'Git tags can be maliciously rewritten or hijacked by an attacker who compromises the third-party action repository, executing arbitrary code inside the CI pipeline and stealing runner secrets' },
      { id: 'c', text: 'Git tags expire after 90 days in GitHub Actions' },
      { id: 'd', text: 'Docker images cannot be referenced by Git tags' },
    ],
    correctOptionId: 'b',
    explanation: 'Git tags are mutable refs; a compromised maintainer account or compromised repository can force-push a malicious commit to an existing tag (like v4). Pinning to a full 40-character commit SHA guarantees immutable execution of audited code, defending against supply chain poisoning.',
    conceptTag: 'cicd-supply-chain-action-pinning',
  },
  {
    id: 'q-devops-deploy-34',
    difficulty: 'medium',
    question: 'What is the function of an Ingress Controller canary annotation (such as nginx.ingress.kubernetes.io/canary: "true") in Kubernetes?',
    codeSnippet: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-canary
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "10"`,
    options: [
      { id: 'a', text: 'It creates a second ingress controller pod running on the master node' },
      { id: 'b', text: 'It encrypts 10% of payload bytes' },
      { id: 'c', text: 'It limits requests to 10 requests per second' },
      { id: 'd', text: 'It instructs the NGINX Ingress controller to route 10% of total incoming requests destined for the host/path to the canary backend Service instead of the primary Service' },
    ],
    correctOptionId: 'd',
    explanation: 'Canary annotations in NGINX Ingress allow traffic splitting without a service mesh. Specifying canary: "true" and canary-weight: "10" routes 10% of incoming production requests to the canary Ingress backend service while sending the remaining 90% to the production service.',
    conceptTag: 'nginx-ingress-canary-annotations',
  },

  // ============================================================================
  // HARD / ADVANCED (Questions 35 - 50)
  // ============================================================================
  {
    id: 'q-devops-deploy-35',
    difficulty: 'hard',
    question: 'How does an Istio VirtualService configure header-based routing to allow internal employees to test a canary release without exposing it to public users?',
    codeSnippet: `apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: checkout-route
spec:
  hosts:
  - checkout.example.com
  http:
  - match:
    - headers:
        x-internal-user:
          exact: "true"
    route:
    - destination:
        host: checkout-svc
        subset: v2
  - route:
    - destination:
        host: checkout-svc
        subset: v1`,
    options: [
      { id: 'a', text: 'It inspects incoming HTTP headers; requests containing x-internal-user: true are routed to destination subset v2 (canary), while all other traffic falls through to subset v1 (stable production)' },
      { id: 'b', text: 'It drops all requests that have the x-internal-user header' },
      { id: 'c', text: 'It encrypts the header using AES-GCM before sending it to v1' },
      { id: 'd', text: 'It executes a preStop hook on pods in subset v2' },
    ],
    correctOptionId: 'a',
    explanation: 'Istio VirtualService evaluates HTTP match blocks sequentially. The first rule matches requests containing the exact header x-internal-user: true and directs them to the v2 subset (canary pods). All other requests fall through to the default rule pointing to v1, allowing safe internal testing on live infrastructure.',
    conceptTag: 'istio-header-based-routing',
  },
  {
    id: 'q-devops-deploy-36',
    difficulty: 'hard',
    question: 'Why is automated Fault Injection (chaos testing) via Service Mesh routing policies critical before promoting a new canary release in a microservice architecture?',
    codeSnippet: `apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings-fault
spec:
  hosts:
  - ratings
  http:
  - fault:
      delay:
        percentage:
          value: 10.0
        fixedDelay: 5s
      abort:
        percentage:
          value: 5.0
        httpStatus: 503
    route:
    - destination:
        host: ratings
        subset: v2`,
    options: [
      { id: 'a', text: 'It verifies that the pod Linux kernel has seccomp enabled' },
      { id: 'b', text: 'It forces the database to rollback uncommitted transactions' },
      { id: 'c', text: 'It tests whether upstream callers implement proper circuit breakers, timeouts, and fallbacks when the new canary version experiences delays or errors, preventing cascading failures across the call graph' },
      { id: 'd', text: 'It checks whether Kubernetes nodes have sufficient disk space' },
    ],
    correctOptionId: 'c',
    explanation: 'Fault injection introduces controlled latency (delays) and errors (aborts) into the canary path at the service mesh layer. This validates that calling services have configured adequate timeouts, retries with exponential backoff, and circuit breakers rather than hanging indefinitely or cascading failure through the system.',
    conceptTag: 'service-mesh-fault-injection',
  },
  {
    id: 'q-devops-deploy-37',
    difficulty: 'hard',
    question: 'In Automated Canary Analysis (ACA) using Kayenta or Prometheus, why is a statistical Mann-Whitney U test superior to simple static threshold checks (e.g. error rate > 1%)?',
    options: [
      { id: 'a', text: 'It runs in O(1) time complexity inside the Linux kernel' },
      { id: 'b', text: 'Static thresholds are illegal under GDPR regulations' },
      { id: 'c', text: 'It compares the metric distributions of the canary against an identical baseline deployment experiencing the exact same ambient traffic conditions, preventing false-positive rollbacks caused by external spikes or global network blips' },
      { id: 'd', text: 'The Mann-Whitney U test encrypts telemetry data across transit' },
    ],
    correctOptionId: 'c',
    explanation: 'Static thresholds fail when external conditions change (e.g. an ISP outage or third-party API outage spikes 5xx errors across all pods). Kayenta deploys both a baseline (same version as prod) and canary under identical conditions and uses non-parametric tests (Mann-Whitney U) to determine if the canary performs worse than the baseline with statistical significance.',
    conceptTag: 'automated-canary-analysis-kayenta',
  },
  {
    id: 'q-devops-deploy-38',
    difficulty: 'hard',
    question: 'How does a GitOps operator like ArgoCD use a Three-Way Merge Patch when reconciling desired Git state with live Kubernetes cluster state?',
    options: [
      { id: 'a', text: 'It merges code across three separate Git branches (main, dev, test)' },
      { id: 'b', text: 'It calculates diffs using the Git Target State, the Live Cluster State, and the Last-Applied-Configuration annotation, allowing cluster-mutated fields (e.g. HPA replicas or cloud-injected annotations) to persist without being overwritten' },
      { id: 'c', text: 'It queries three independent NTP servers to ensure timestamp alignment' },
      { id: 'd', text: 'It creates three replicas of every custom resource definition' },
    ],
    correctOptionId: 'b',
    explanation: 'A two-way diff between Git and live state would continuously revert legitimate runtime additions (like annotations injected by admission webhooks or replica counts modified by HPA). The three-way merge patch incorporates the last-applied-configuration to detect what Git changed, preserving runtime fields that Git does not manage.',
    conceptTag: 'gitops-three-way-merge-patch',
  },
  {
    id: 'q-devops-deploy-39',
    difficulty: 'hard',
    question: 'In an ArgoCD-managed cluster, what causes an infinite reconciliation sync loop when using HorizontalPodAutoscaler (HPA), and how is it resolved?',
    codeSnippet: `# Git Manifest:
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 3 # Git declares 3 replicas, but HPA scales to 15!`,
    options: [
      { id: 'a', text: 'HPA causes memory leaks in the kube-apiserver' },
      { id: 'b', text: 'ArgoCD only supports StatefulSets for autoscaling' },
      { id: 'c', text: 'The Linux cgroup controller limits HPA to 3 pods' },
      { id: 'd', text: 'Git specifies replicas: 3 while HPA scales live replicas to 15; ArgoCD detects drift and forces replicas back to 3, causing fighting. Resolved by removing replicas from Git Deployment spec or configuring ignoreDifferences for spec.replicas' },
    ],
    correctOptionId: 'd',
    explanation: 'If spec.replicas is hardcoded in Git, HPA will scale the deployment to match traffic, but ArgoCD will flag the divergence as OutOfSync and overwrite replicas back to the Git value, causing a flapping sync loop. The fix is to omit spec.replicas from the Deployment manifest or add ignoreDifferences in the ArgoCD Application spec.',
    conceptTag: 'argocd-hpa-sync-loop-mitigation',
  },
  {
    id: 'q-devops-deploy-40',
    difficulty: 'hard',
    question: 'How do Kubernetes Volume-mounted Secrets update when a Secret is modified, and why does this NOT trigger an automatic application restart?',
    options: [
      { id: 'a', text: 'Volume-mounted secrets are updated via atomic symlink directory swaps using tmpfs by the kubelet, but the application process is not signaled or restarted unless an external controller watches the secret or inotify reloads it' },
      { id: 'b', text: 'Kubernetes reboots the worker node whenever a Secret is modified' },
      { id: 'c', text: 'The kubelet sends SIGKILL to all containers mounting the secret' },
      { id: 'd', text: 'Secrets are immutable and can never be modified in Kubernetes' },
    ],
    correctOptionId: 'a',
    explanation: 'The kubelet uses atomic symlink updates (pointing ..data to a new timestamped folder) on tmpfs to refresh volume-mounted secrets without restarting containers. However, most applications load config once at startup; unless the app uses inotify to detect file changes or a controller (like Reloader) triggers a rollout, the app continues using old credentials in memory.',
    conceptTag: 'k8s-secret-rotation-symlink-updates',
  },
  {
    id: 'q-devops-deploy-41',
    difficulty: 'hard',
    question: 'Why do Environment Variables sourced from Secrets (valueFrom.secretKeyRef) fail to support zero-downtime secret rotation without a pod rollout?',
    codeSnippet: `env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: db-credentials
      key: password`,
    options: [
      { id: 'a', text: 'The kubelet deletes the secret from etcd once mounted as an env var' },
      { id: 'b', text: 'Kubernetes environment variables are limited to 16 characters' },
      { id: 'c', text: 'Secret references in environment variables expire after 24 hours' },
      { id: 'd', text: 'The Linux kernel initializes process environment variables only during fork()/execve(); environment variables of a running process cannot be modified externally by the kubelet or host OS' },
    ],
    correctOptionId: 'd',
    explanation: 'In POSIX operating systems, environment variables are passed to a process at execution time and reside in process memory. The Linux kernel provides no mechanism for an external process (like kubelet) to alter the environment block of an already running process. Updating the secret requires creating new pods.',
    conceptTag: 'k8s-env-var-secret-immutability',
  },
  {
    id: 'q-devops-deploy-42',
    difficulty: 'hard',
    question: 'How does Stakater Reloader solve the secret and configmap rotation problem in Kubernetes clusters?',
    options: [
      { id: 'a', text: 'By running a controller that watches ConfigMap and Secret changes, discovers associated Deployments/StatefulSets via annotations (reloader.stakater.com/auto), and performs an automated rolling upgrade by updating an annotation on the Pod template' },
      { id: 'b', text: 'By decrypting secrets and injecting them into the Linux kernel keyring' },
      { id: 'c', text: 'By restarting the Docker daemon on every worker node' },
      { id: 'd', text: 'By converting all secrets into environment variables automatically' },
    ],
    correctOptionId: 'a',
    explanation: 'Stakater Reloader watches ConfigMap/Secret resources. When a change occurs, it identifies workloads annotated with reloader.stakater.com/auto: "true" and computes a hash of the data, updating an annotation in the Pod template. This triggers a standard, zero-downtime rolling update of the pods.',
    conceptTag: 'k8s-reloader-secret-updates',
  },
  {
    id: 'q-devops-deploy-43',
    difficulty: 'hard',
    question: 'In a HashiCorp Vault Agent sidecar pattern, how is dynamic secret rotation (e.g. database credentials with 1-hour TTL) achieved without terminating application pods?',
    options: [
      { id: 'a', text: 'Vault Agent mounts an SSH tunnel that rewrites the application source code' },
      { id: 'b', text: 'Vault Agent stores passwords in public DNS records' },
      { id: 'c', text: 'Vault Agent authenticates via Kubernetes Service Account tokens, continuously renews dynamic leases, writes fresh credentials to a shared memory volume (emptyDir), and executes a configured exec reload command (or sends SIGHUP) to the app container' },
      { id: 'd', text: 'Dynamic database credentials do not require rotation' },
    ],
    correctOptionId: 'c',
    explanation: 'Vault Agent runs as a sidecar, logging into Vault using Kubernetes ServiceAccount JWTs. It leases dynamic database credentials, renders them into a shared emptyDir volume (/vault/secrets), and automatically executes a reload command or sends SIGHUP when the lease is about to expire, achieving continuous rotation with zero restarts.',
    conceptTag: 'vault-agent-sidecar-rotation',
  },
  {
    id: 'q-devops-deploy-44',
    difficulty: 'hard',
    question: 'What is SLSA (Supply-chain Levels for Software Artifacts) Level 3 provenance, and how does it protect CI/CD pipelines from malicious tampering?',
    options: [
      { id: 'a', text: 'It requires three developers to approve every pull request' },
      { id: 'b', text: 'It guarantees that build artifacts are produced on an isolated, hardened, ephemeral build platform with non-falsifiable signed provenance attesting to the source repo, build config, and dependencies' },
      { id: 'c', text: 'It mandates that all container images are encrypted using AES-256' },
      { id: 'd', text: 'It requires continuous penetration testing of the Kubernetes master node' },
    ],
    correctOptionId: 'b',
    explanation: 'SLSA Level 3 requires that the build runs on a dedicated, isolated build platform (preventing builds from influencing one another) and generates cryptographically signed, unforgeable provenance that certifies the exact Git commit, builder identity, and input parameters, preventing supply chain injection.',
    conceptTag: 'supply-chain-slsa-provenance',
  },
  {
    id: 'q-devops-deploy-45',
    difficulty: 'hard',
    question: 'How does Sigstore Cosign implement "keyless" container image signing in automated CI/CD workflows?',
    options: [
      { id: 'a', text: 'It uses an OIDC identity token from the CI provider (e.g. GitHub Actions) to obtain a short-lived x509 certificate from the Fulcio CA, signs the image digest, and logs the cryptographic proof to the Rekor public transparency ledger' },
      { id: 'b', text: 'By computing the MD5 checksum of the Dockerfile' },
      { id: 'c', text: 'By storing private keys in a public GitHub repository' },
      { id: 'd', text: 'By embedding the developer biometric fingerprint into the container layer' },
    ],
    correctOptionId: 'a',
    explanation: 'Keyless signing avoids long-lived private keys. Cosign exchanges the CI workflow OIDC identity token for an ephemeral certificate from Fulcio (valid for minutes). It signs the container digest, publishes the signature to the registry, and records the signed artifact proof in Rekor (a tamper-resistant transparency log).',
    conceptTag: 'sigstore-cosign-keyless-signing',
  },
  {
    id: 'q-devops-deploy-46',
    difficulty: 'hard',
    question: 'How do Kubernetes admission controllers (such as Kyverno or OPA Gatekeeper) enforce Sigstore Cosign signature verification at deployment time?',
    codeSnippet: `apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-image-signature
spec:
  rules:
  - name: verify-signature
    match:
      resources:
        kinds: [Pod]
    verifyImages:
    - imageReferences: ["ghcr.io/my-org/*"]
      attestors:
      - entries:
        - keyless:
            issuer: https://token.actions.githubusercontent.com
            subject: https://github.com/my-org/my-repo/*`,
    options: [
      { id: 'a', text: 'By compiling the Kyverno policy into Linux iptables rules' },
      { id: 'b', text: 'By intercepting Pod creation requests via ValidatingWebhookConfiguration, querying the registry and Rekor for valid signatures matching the specified OIDC issuer/subject, and rejecting unsigned or unverified images' },
      { id: 'c', text: 'By deleting worker nodes that run untrusted images' },
      { id: 'd', text: 'By forcing all pods to run as root' },
    ],
    correctOptionId: 'b',
    explanation: 'Kyverno acts as a validating admission webhook. When a pod is submitted, Kyverno queries the container registry for Cosign signatures and verifies the cryptographic signature against the Fulcio certificate authority and Rekor transparency log. If unsigned or signed by an unauthorized identity, the admission request is denied.',
    conceptTag: 'kyverno-cosign-admission-verification',
  },
  {
    id: 'q-devops-deploy-47',
    difficulty: 'hard',
    question: 'What is a Software Bill of Materials (SBOM), and what standard formats (e.g. CycloneDX, SPDX) are generated during CI/CD artifact creation?',
    options: [
      { id: 'a', text: 'A financial invoice detailing cloud hosting compute costs' },
      { id: 'b', text: 'A database schema backup file' },
      { id: 'c', text: 'A list of all Git commit messages in a release' },
      { id: 'd', text: 'A machine-readable formal inventory containing all components, libraries, transitive dependencies, licenses, and file digests comprising the software build artifact' },
    ],
    correctOptionId: 'd',
    explanation: 'An SBOM is a comprehensive ingredients list of all software components (direct and transitive dependencies, versions, packages, licenses, digests). Tools like Syft generate SBOMs in standard CycloneDX or SPDX JSON formats, allowing automated vulnerability scanners (Grype, Dependency-Track) to track vulnerabilities across production fleets.',
    conceptTag: 'sbom-cyclonedx-spdx',
  },
  {
    id: 'q-devops-deploy-48',
    difficulty: 'hard',
    question: 'How does an automated Vulnerability Gate (e.g. using Trivy or Grype) fail a CI/CD build based on vulnerability severity and exploitability status?',
    codeSnippet: `trivy image \\
  --exit-code 1 \\
  --severity CRITICAL,HIGH \\
  --ignore-unfixed \\
  my-app:v1.2.0`,
    options: [
      { id: 'a', text: 'It automatically patches vulnerable C-libraries by rewriting ELF binaries' },
      { id: 'b', text: 'It deletes the container image from the local runner' },
      { id: 'c', text: 'It blocks the pipeline (returns exit code 1) only if CRITICAL or HIGH vulnerabilities exist for which vendor fixes/patches are available, ignoring unfixable CVEs to prevent blocking releases on zero-day flaws with no patch' },
      { id: 'd', text: 'It posts a message to Twitter with the CVE details' },
    ],
    correctOptionId: 'c',
    explanation: 'Using --exit-code 1 fails the pipeline when matching vulnerabilities are found. Combining with --severity CRITICAL,HIGH and --ignore-unfixed creates an actionable quality gate: it fails the build only if serious vulnerabilities exist that the team can actually fix by upgrading base packages or libraries, avoiding alert fatigue.',
    conceptTag: 'cicd-vulnerability-quality-gates',
  },
  {
    id: 'q-devops-deploy-49',
    difficulty: 'hard',
    question: 'In GitOps, what is the role of Flux Kustomize Controller and Helm Controller in automating progressive delivery and drift correction?',
    options: [
      { id: 'a', text: 'They replace the Linux systemd init process' },
      { id: 'b', text: 'They continuously watch Git repositories and OCI artifacts, reconcile desired manifests against the Kubernetes API, enforce drift correction by overriding manual mutations, and emit CloudEvents for observability' },
      { id: 'c', text: 'They format Markdown files in Git repositories' },
      { id: 'd', text: 'They monitor Kubernetes cluster power consumption' },
    ],
    correctOptionId: 'b',
    explanation: 'Flux controllers (Source, Kustomize, Helm) continuously poll repositories (Git/OCI), generate manifests, and reconcile them with the live cluster. If an out-of-band change causes drift, the controller reapplies the desired state, ensuring zero-drift automated state governance.',
    conceptTag: 'flux-gitops-reconciliation',
  },
  {
    id: 'q-devops-deploy-50',
    difficulty: 'hard',
    question: 'Why should CI/CD pipelines generate and attach in-toto attestations to container images using Cosign?',
    codeSnippet: `cosign attest --keyless \\
  --type cyclonedx \\
  --predicate sbom.json \\
  ghcr.io/my-org/my-app:sha-abcdef`,
    options: [
      { id: 'a', text: 'To allow the container to run without an operating system' },
      { id: 'b', text: 'It increases the container network bandwidth limit' },
      { id: 'c', text: 'To reduce image layer compression size' },
      { id: 'd', text: 'It cryptographically binds authenticated metadata (e.g. vulnerability scan reports, test results, and SBOMs) to the container image digest in the registry, enabling policy engines to verify that security checks actually executed before deployment' },
    ],
    correctOptionId: 'd',
    explanation: 'Attestations are authenticated claims signed alongside the container image. By creating in-toto attestations for SBOMs, test results, and vulnerability reports, admission controllers can verify not only that the image came from an authorized builder, but also that required security scans passed without policy violations.',
    conceptTag: 'in-toto-attestations-cosign',
  },
];
