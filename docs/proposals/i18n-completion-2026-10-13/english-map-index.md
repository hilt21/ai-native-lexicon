# English map review index

Full English candidate files retain the original graph and pinned sources. New wording remains draft.

## Matt Pocock Skills Map

[Overview](skill-maps/mattpocock/map.yaml) · [Relationships](skill-maps/mattpocock/relations.yaml)

| Node | English summary |
| --- | --- |
| [ask-matt](skill-maps/mattpocock/nodes/ask-matt.yaml) | Recommend the skill or work path that fits the current situation. |
| [code-review](skill-maps/mattpocock/nodes/code-review.yaml) | Review a bounded diff independently against Standards and Spec. |
| [codebase-design](skill-maps/mattpocock/nodes/codebase-design.yaml) | Use deep-module vocabulary to design smaller interfaces, deeper implementations and clearer seams. |
| [diagnosing-bugs](skill-maps/mattpocock/nodes/diagnosing-bugs.yaml) | Find and fix the root cause using short feedback that captures the actual symptom; protect the fix at the correct seam, or record the missing seam. |
| [domain-modeling](skill-maps/mattpocock/nodes/domain-modeling.yaml) | Maintain a shared project vocabulary and records of important decisions. |
| [git-guardrails-claude-code](skill-maps/mattpocock/nodes/git-guardrails-claude-code.yaml) | Use Claude Code hooks to block specified dangerous Git commands. |
| [grill-me](skill-maps/mattpocock/nodes/grill-me.yaml) | Expose unresolved branches in a plan or design through sustained questioning. |
| [grill-with-docs](skill-maps/mattpocock/nodes/grill-with-docs.yaml) | Clarify a design through sustained questioning while recording domain terms and ADRs. |
| [grilling](skill-maps/mattpocock/nodes/grilling.yaml) | Provide a reusable interview primitive that questions a design until its open branches are resolved. |
| [handoff](skill-maps/mattpocock/nodes/handoff.yaml) | Condense the current session into a portable handoff for another agent or session. |
| [implement-spec](skill-maps/mattpocock/nodes/implement-spec.yaml) | Implement a complete specification in parallel on an integration branch. |
| [implement](skill-maps/mattpocock/nodes/implement.yaml) | Implement a defined unit of work from a specification or tickets. |
| [improve-codebase-architecture](skill-maps/mattpocock/nodes/improve-codebase-architecture.yaml) | Survey the codebase for opportunities to make modules deeper and easier to maintain. |
| [migrate-to-shoehorn](skill-maps/mattpocock/nodes/migrate-to-shoehorn.yaml) | Migrate test-data as assertions to @total-typescript/shoehorn. |
| [pr](skill-maps/mattpocock/nodes/pr.yaml) | Write a PR body that makes risk and evidence quick to assess. |
| [prototype](skill-maps/mattpocock/nodes/prototype.yaml) | Answer a design question with disposable code when discussion alone is insufficient. |
| [research](skill-maps/mattpocock/nodes/research.yaml) | Delegate primary-source research to a background agent and retain a referenceable repository file. |
| [retro](skill-maps/mattpocock/nodes/retro.yaml) | Identify opportunities to improve the agent environment after a coding session. |
| [scaffold-exercises](skill-maps/mattpocock/nodes/scaffold-exercises.yaml) | Create course-conforming exercise directories, problems, solutions and explainer stubs. |
| [setup-matt-pocock-skills](skill-maps/mattpocock/nodes/setup-matt-pocock-skills.yaml) | Configure the repository conventions used by Matt Pocock skills. |
| [setup-pre-commit](skill-maps/mattpocock/nodes/setup-pre-commit.yaml) | Add formatting and existing type-check/test scripts to pre-commit; omit and report scripts that are absent. |
| [tdd](skill-maps/mattpocock/nodes/tdd.yaml) | Implement behavior in red-to-green slices at an agreed public seam; handle refactoring during review. |
| [teach](skill-maps/mattpocock/nodes/teach.yaml) | Teach a skill or concept over multiple sessions in the current workspace. |
| [to-questionnaire](skill-maps/mattpocock/nodes/to-questionnaire.yaml) | Turn decision gaps only an external stakeholder can resolve into a questionnaire. |
| [to-spec](skill-maps/mattpocock/nodes/to-spec.yaml) | Turn an already clarified conversation into a durable specification. |
| [to-tickets](skill-maps/mattpocock/nodes/to-tickets.yaml) | Split a plan or specification into tracer-bullet tickets with blocking relationships. |
| [triage](skill-maps/mattpocock/nodes/triage.yaml) | Process incoming issues and PRs through states into actionable work. |
| [wait-what](skill-maps/mattpocock/nodes/wait-what.yaml) | Re-explain a misunderstood message using missing context and shared vocabulary. |
| [wayfinder](skill-maps/mattpocock/nodes/wayfinder.yaml) | Turn a large, unclear effort that exceeds one session into a decision map. |
| [wizard](skill-maps/mattpocock/nodes/wizard.yaml) | Generate an interactive Bash wizard for external steps only a person can perform. |
| [writing-for-agents](skill-maps/mattpocock/nodes/writing-for-agents.yaml) | Write steering and reference documents that agents can reliably consume. |

| Journey | English summary |
| --- | --- |
| [Build a feature](skill-maps/mattpocock/journeys/build-a-feature.yaml) | Implement small, clear work directly. For work spanning sessions, establish a specification and tickets, then choose per-ticket implementation or whole-graph orchestration. Implementation includes TDD and review. |
| [Choose the right skill](skill-maps/mattpocock/journeys/choose-a-skill.yaml) | Use the common entry to identify the work path that fits the current task. |
| [Clarify an idea](skill-maps/mattpocock/journeys/clarify-an-idea.yaml) | Use structured questions to resolve implicit choices and record domain terms and ADRs when a repository exists. |
| [Fix a difficult bug](skill-maps/mattpocock/journeys/fix-a-hard-bug.yaml) | Establish failing feedback that captures the actual symptom, then minimize, hypothesize, instrument and fix. Leave a regression when the correct seam exists; otherwise record the testability gap. |
| [Hand work to another agent or person](skill-maps/mattpocock/journeys/handoff-work.yaml) | Choose a context handoff or a questionnaire for external decision gaps according to the receiver. |
| [Improve code architecture](skill-maps/mattpocock/journeys/improve-codebase.yaml) | Survey deepening opportunities, select one candidate and enter the normal design/implementation process. |
| [Explore an effort too large to clarify at once](skill-maps/mattpocock/journeys/plan-a-huge-effort.yaml) | Use decision tickets to resolve unknowns until the effort can become a normal specification and tickets. |

## pstack Skill Map

[Overview](skill-maps/pstack/map.yaml) · [Relationships](skill-maps/pstack/relations.yaml)

| Node | English summary |
| --- | --- |
| [architect](skill-maps/pstack/nodes/architect.yaml) | Define types, interfaces, modules and data structures before writing code. |
| [arena](skill-maps/pstack/nodes/arena.yaml) | Expand the design space through independent candidates and blind judging. |
| [authoring-a-skill](skill-maps/pstack/nodes/authoring-a-skill.yaml) | Create or modify a pstack/Cursor skill. |
| [automate-me](skill-maps/pstack/nodes/automate-me.yaml) | Encode stable personal work preferences in a reusable mode skill. |
| [autonomous-run](skill-maps/pstack/nodes/autonomous-run.yaml) | Progress one unattended task to a fixed exit predicate. |
| [autopilot-full](skill-maps/pstack/nodes/autopilot-full.yaml) | One owner takes each PR from build to merge; the root performs independent verification, countersigning and audits. |
| [autopilot-stack](skill-maps/pstack/nodes/autopilot-stack.yaml) | Automatically build and verify a linear PR stack, leaving final landing to the operator. |
| [babysit](skill-maps/pstack/nodes/babysit.yaml) | Progress an open PR or stack to merge-ready without final landing. |
| [benchmark-checklist](skill-maps/pstack/nodes/benchmark-checklist.yaml) | Check whether performance figures measure the intended work. |
| [blast-radius](skill-maps/pstack/nodes/blast-radius.yaml) | Find effects beyond the diff and demonstrate safety assumptions through actual execution. |
| [bro](skill-maps/pstack/nodes/bro.yaml) | Explain the previous technical reply in plain language. |
| [bug-fix](skill-maps/pstack/nodes/bug-fix.yaml) | Fix bugs through reproducible, evidence-based investigation. |
| [correct](skill-maps/pstack/nodes/correct.yaml) | Turn repeated human corrections into structural constraints. |
| [create-verification-skill](skill-maps/pstack/nodes/create-verification-skill.yaml) | Build a reusable interface for verifying the real product. |
| [eval](skill-maps/pstack/nodes/eval.yaml) | Use blind evaluation to test whether a skill or prompt improves agent behavior. |
| [feature](skill-maps/pstack/nodes/feature.yaml) | Design, implement in parallel, verify on the real surface and review a new feature. |
| [figure-it-out](skill-maps/pstack/nodes/figure-it-out.yaml) | Design a temporary auditable workflow when existing playbooks do not fit. |
| [hillclimb](skill-maps/pstack/nodes/hillclimb.yaml) | Continuously optimize one metric through reversible iterations. |
| [how](skill-maps/pstack/nodes/how.yaml) | Build a mental model of how the system works. |
| [interrogate](skill-maps/pstack/nodes/interrogate.yaml) | Use multiple models for adversarial code or design review. |
| [investigation](skill-maps/pstack/nodes/investigation.yaml) | Investigate read-only and provide evidence-backed explanations or recommendations. |
| [maintain-verification-skill](skill-maps/pstack/nodes/maintain-verification-skill.yaml) | Continuously calibrate the verification skill and Feature Map against code changes. |
| [make-bot-ui](skill-maps/pstack/nodes/make-bot-ui.yaml) | Build a simple control UI that triggers agent automation. |
| [multi-phase-plan](skill-maps/pstack/nodes/multi-phase-plan.yaml) | Plan large multi-phase work as executable owner checklists and evidence for operator audits. |
| [no-comments](skill-maps/pstack/nodes/no-comments.yaml) | Remove explanatory AI comments and express real constraints structurally. |
| [opening-a-pr](skill-maps/pstack/nodes/opening-a-pr.yaml) | Turn a verified diff into a reviewable PR. |
| [orchestrate](skill-maps/pstack/nodes/orchestrate.yaml) | Coordinate a multi-day program with dozens or hundreds of agents through durable state. |
| [pause-safely](skill-maps/pstack/nodes/pause-safely.yaml) | Pause work at a safe boundary recoverable by a cold-start agent. |
| [perf-issue](skill-maps/pstack/nodes/perf-issue.yaml) | Measure, fix and demonstrate a one-off performance problem. |
| [poteto-help](skill-maps/pstack/nodes/poteto-help.yaml) | Explain pstack and help the user select the right entry. |
| [poteto-mode](skill-maps/pstack/nodes/poteto-mode.yaml) | Enter pstack through its main router and engineering work style. |
| [principle-attack-the-premise](skill-maps/pstack/nodes/principle-attack-the-premise.yaml) | After repeated failed fixes, stop carrying the shared premise forward and recheck it. |
| [principle-boundary-discipline](skill-maps/pstack/nodes/principle-boundary-discipline.yaml) | Concentrate validation and adapters at system boundaries; trust typed data internally. |
| [principle-build-the-lever](skill-maps/pstack/nodes/principle-build-the-lever.yaml) | Prefer tools that can repeatably execute or verify the task. |
| [principle-encode-lessons-in-structure](skill-maps/pstack/nodes/principle-encode-lessons-in-structure.yaml) | When an instruction repeats a second time, move the rule into structure. |
| [principle-exhaust-the-design-space](skill-maps/pstack/nodes/principle-exhaust-the-design-space.yaml) | Compare several prototypes before an important new design. |
| [principle-experience-first](skill-maps/pstack/nodes/principle-experience-first.yaml) | Prioritize user experience and completeness in product tradeoffs. |
| [principle-explain-the-number](skill-maps/pstack/nodes/principle-explain-the-number.yaml) | Explain the limiter and measurement mechanism before interpreting a number. |
| [principle-fix-root-causes](skill-maps/pstack/nodes/principle-fix-root-causes.yaml) | Reproduce and establish the mechanism before fixing the root cause. |
| [principle-foundational-thinking](skill-maps/pstack/nodes/principle-foundational-thinking.yaml) | Choose the core data structure and shared-state model first. |
| [principle-guard-the-context-window](skill-maps/pstack/nodes/principle-guard-the-context-window.yaml) | Put large payloads in subagent context; keep only summaries in the main context. |
| [principle-laziness-protocol](skill-maps/pstack/nodes/principle-laziness-protocol.yaml) | Prefer deletion and the minimum sufficient change. |
| [principle-make-operations-idempotent](skill-maps/pstack/nodes/principle-make-operations-idempotent.yaml) | Design crashes and retries as normal paths so repeated execution converges to the same result. |
| [principle-migrate-callers-then-delete-legacy-apis](skill-maps/pstack/nodes/principle-migrate-callers-then-delete-legacy-apis.yaml) | Migrate the new API and callers in one wave, then remove the old API. |
| [principle-minimize-reader-load](skill-maps/pstack/nodes/principle-minimize-reader-load.yaml) | Assess quality by reducing layers readers must cross and hidden state they must infer. |
| [principle-model-the-domain](skill-maps/pstack/nodes/principle-model-the-domain.yaml) | Express the domain through structures, state machines, registries and typed models. |
| [principle-never-block-on-the-human](skill-maps/pstack/nodes/principle-never-block-on-the-human.yaml) | Do reversible work first; involve the person for irreversible choices or preferences experiments cannot resolve. |
| [principle-outcome-oriented-execution](skill-maps/pstack/nodes/principle-outcome-oriented-execution.yaml) | Converge migrations on the target architecture rather than permanent intermediate states. |
| [principle-prove-it-works](skill-maps/pstack/nodes/principle-prove-it-works.yaml) | Verify the actual artifact and actual behavior before completion. |
| [principle-redesign-from-first-principles](skill-maps/pstack/nodes/principle-redesign-from-first-principles.yaml) | Treat a new requirement as if it had existed from day one and rederive the structure. |
| [principle-separate-before-serializing-shared-state](skill-maps/pstack/nodes/principle-separate-before-serializing-shared-state.yaml) | Eliminate shared writes before considering serialization in concurrent work. |
| [principle-sequence-verifiable-units](skill-maps/pstack/nodes/principle-sequence-verifiable-units.yaml) | Split large work into units each verifiable on its own. |
| [principle-subtract-before-you-add](skill-maps/pstack/nodes/principle-subtract-before-you-add.yaml) | Remove dead code and redundant structure before adding more. |
| [principle-test-behavior-not-implementation](skill-maps/pstack/nodes/principle-test-behavior-not-implementation.yaml) | Test user-observable behavior rather than implementation details. |
| [principle-type-system-discipline](skill-maps/pstack/nodes/principle-type-system-discipline.yaml) | Use the type system to make invalid states hard to express. |
| [prototype](skill-maps/pstack/nodes/prototype.yaml) | Use disposable prototypes to choose a design quickly. |
| [recall](skill-maps/pstack/nodes/recall.yaml) | Restore working context from history and current state. |
| [refactoring](skill-maps/pstack/nodes/refactoring.yaml) | Reshape structure while preserving behavior. |
| [reflect](skill-maps/pstack/nodes/reflect.yaml) | Reflect on an agent run and route lessons into concrete skill improvements. |
| [runtime-forensics](skill-maps/pstack/nodes/runtime-forensics.yaml) | Collect signals from a running process and diagnose read-only. |
| [session-pickup](skill-maps/pstack/nodes/session-pickup.yaml) | Resume from a prior trail without repeating work. |
| [setup-pstack](skill-maps/pstack/nodes/setup-pstack.yaml) | Configure models and reasoning budgets for pstack roles. |
| [shipping](skill-maps/pstack/nodes/shipping.yaml) | Use independent verifiers to decide which PRs may actually land. |
| [show-me-your-work](skill-maps/pstack/nodes/show-me-your-work.yaml) | Condense long agent activity into an auditable decision trail. |
| [swarm](skill-maps/pstack/nodes/swarm.yaml) | Distribute separable work to workers concurrently and aggregate results. |
| [tdd](skill-maps/pstack/nodes/tdd.yaml) | Capture the bug in a failing test when a cheap, reliable test seam exists. |
| [teach](skill-maps/pstack/nodes/teach.yaml) | Organize how and why findings into an explanation people can understand. |
| [technical-writing](skill-maps/pstack/nodes/technical-writing.yaml) | Reduce ambiguity in documents and PRs through shared engineering-writing rules. |
| [trace-forensics](skill-maps/pstack/nodes/trace-forensics.yaml) | Investigate existing traces, heaps or profiles offline. |
| [typescript-best-practices](skill-maps/pstack/nodes/typescript-best-practices.yaml) | Reduce invalid TypeScript states through types and boundary parsing. |
| [unslop](skill-maps/pstack/nodes/unslop.yaml) | Remove AI mannerisms, templated wording and content without information. |
| [visual-parity](skill-maps/pstack/nodes/visual-parity.yaml) | Use baseline screenshots as the specification for pixel-exact migration. |
| [why](skill-maps/pstack/nodes/why.yaml) | Explain why the system took its current form, using evidence. |
| [worktree-cleanup](skill-maps/pstack/nodes/worktree-cleanup.yaml) | Safely clean old worktrees, simulators and large caches. |

| Journey | English summary |
| --- | --- |
| [Build a new feature](skill-maps/pstack/journeys/build-feature.yaml) | Build a new feature: from task entry to inspectable output. |
| [Fix a bug](skill-maps/pstack/journeys/fix-bug.yaml) | Fix a bug: from task entry to inspectable output. |
| [Optimize performance](skill-maps/pstack/journeys/improve-performance.yaml) | Optimize performance: from task entry to inspectable output. |
| [Improve the system from this run](skill-maps/pstack/journeys/improve-the-system.yaml) | Improve the system from this run: from task entry to inspectable output. |
| [Progress work in parallel](skill-maps/pstack/journeys/run-program.yaml) | Progress work in parallel: from task entry to inspectable output. |
| [Run an agent autonomously](skill-maps/pstack/journeys/run-unattended.yaml) | Run an agent autonomously: from task entry to inspectable output. |
| [Understand the system first](skill-maps/pstack/journeys/understand-system.yaml) | Understand the system first: from task entry to inspectable output. |
