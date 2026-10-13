# Primitive Chinese draft review

Canonical text is the translation source. Official references guide terminology only. All new units remain draft; existing reviewed units retain their prior approval.

## Capability / Tool (capability-tool)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | An ability to produce outcomes, together with the callable operations that may make that ability available. | 产生结果的能力，以及使该能力可用的可调用操作。 | draft |
| scope | Systems that act through identifiable abilities and callable operations. | 通过明确能力和可调用操作采取行动的系统。 | draft |
| usage | Expose bounded operations with clear inputs, effects, and observable results. | 提供范围受限的操作，并明确输入、影响和可观察结果。 | draft |
| distinctions | A capability is an ability; a tool is a callable interface that realizes some ability. A skill need not be an executable tool. | 能力描述能够做什么；工具是实现某种能力的可调用接口。技能无需是可执行工具。 | draft |
| composition.pattern | Reasoning → Tool Input → Execution → Evidence | 推理 → 工具输入 → 执行 → 证据 | draft |
| composition.example | A document agent invokes a search tool that returns identified source passages rather than unrestricted database access. | 文档智能体调用搜索工具，返回带标识的来源片段，无需获得不受限制的数据库访问。 | draft |
| definitions.name | Capability | 能力 | draft |
| definitions.text | An ability to produce a class of outcomes under specified conditions; it may be provided by a person, model, process, or tool. | 在规定条件下产生某类结果的能力，可由人、模型、过程或工具提供。 | draft |
| considerations [0] | Capability does not imply permission. | 具有能力不意味着具有权限。 | draft |
| considerations [1] | Tool execution may fail or have nondeterministic external effects; define those semantics explicitly. | 工具执行可能失败，也可能产生不确定的外部影响；应明确这些语义。 | draft |
| ownership.rationale | Runtime implementations execute callable operations and report results; models may select tools without becoming their authority. | 运行时实现执行可调用操作并报告结果；模型可以选择工具，但不会因此成为工具的授权主体。 | draft |
| priority.scope | Systems that act through identifiable abilities and callable operations. | 通过明确能力和可调用操作采取行动的系统。 | draft |
| priority.rationale | An acting system must identify what operations are available and what effects they can produce before selecting or authorizing them. | 能够采取行动的系统必须先明确可用操作及其可能影响，再选择或授权操作。 | draft |

## Context (context)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | The information directly available to the current reasoning or decision process. | 当前推理或决策过程能够直接使用的信息。 | draft |
| scope | AI reasoning and decision processes with a bounded set of directly available information. | 直接可用信息范围有限的 AI 推理和决策过程。 | draft |
| usage | Supply the facts and instructions needed for the present decision without flooding the reasoning process. | 提供当前决策所需的事实和指令，避免向推理过程灌入过量信息。 | draft |
| distinctions | Context is currently accessible information; memory is information retained for later retrieval and state holds authoritative current facts. | 上下文是当前可访问的信息；记忆保留信息以供后续检索；状态保存权威的当前事实。 | draft |
| composition.pattern | State + Retrieved Memory + Task → Context | 状态 + 检索到的记忆 + 任务 → 上下文 | draft |
| composition.example | A coding agent receives the relevant function, current failure, accepted constraints, and latest test output. | 编码智能体获得相关函数、当前失败信息、已接受约束和最新测试输出。 | draft |
| considerations [0] | Availability does not establish truth or authority. | 信息可用不代表它真实或具有权威性。 | draft |
| considerations [1] | Preserve source identity and separate external content from instructions. | 保留来源身份，并将外部内容与指令分开。 | draft |
| ownership.rationale | Software selects and bounds inputs; LLMs can help assess relevance and summarize with traceable references. | 软件选择并限制输入；大语言模型可协助判断相关性，并提供具有可追溯引用的摘要。 | draft |
| priority.scope | AI reasoning and decision processes with a bounded set of directly available information. | 直接可用信息范围有限的 AI 推理和决策过程。 | draft |
| priority.rationale | A reasoning process cannot use unavailable information, so input selection and authority must be explicit in its design. | 推理过程无法使用不可用的信息，因此设计须明确输入选择和权威性。 | draft |

## Execution (execution)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | The attempt to perform an authorized operation that can affect an actual system or environment. | 尝试执行已授权且能够影响实际系统或环境的操作。 | draft |
| scope | Systems that perform operations rather than only describe proposed work. | 实际执行操作，而非仅描述提议工作的系统。 | draft |
| usage | Separate proposed intent from attempted actions and confirmed effects. | 区分提议意图、已尝试操作和已确认影响。 | draft |
| distinctions | Execution is action, not narration, planning, or a guarantee of successful state change. | 执行是行动；叙述、规划或对状态成功变化的保证都不能代替执行。 | draft |
| composition.pattern | Validated Intent + Permission → Executor → Observed Result | 已验证意图 + 权限 → 执行器 → 观察到的结果 | draft |
| composition.example | A coding agent requests a file edit; the filesystem operation and subsequent read establish what changed. | 编码智能体请求编辑文件；文件系统操作及随后的读取确定实际变化。 | draft |
| definitions.name | Execution | 执行 | draft |
| definitions.text | The attempt to carry out an authorized action through mechanisms that can affect the actual system or environment. | 通过能够影响实际系统或环境的机制，尝试实施已授权操作。 | draft |
| considerations [0] | A successful request receipt does not prove the intended effect occurred. | 成功收到请求不能证明预期影响已经发生。 | draft |
| considerations [1] | Handle partial failure and uncertain external outcomes explicitly. | 明确处理部分失败和不确定的外部结果。 | draft |
| ownership.rationale | Functions, scripts, APIs, transactions, and state machines perform actions and expose their actual outcomes. | 函数、脚本、API、事务和状态机实施操作并呈现实际结果。 | draft |
| priority.scope | Systems that perform operations rather than only describe proposed work. | 实际执行操作，而非仅描述提议工作的系统。 | draft |
| priority.rationale | Acting systems must distinguish proposed intent from attempted operations and confirmed effects to make truthful progress claims. | 能够采取行动的系统必须区分提议意图、已尝试操作和已确认影响，才能如实报告进度。 | draft |

## Feedback (feedback)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Information about action results that returns to influence subsequent decisions. | 返回并影响后续决策的操作结果信息。 | draft |
| scope | Systems where action results can influence subsequent decisions. | 操作结果可以影响后续决策的系统。 | draft |
| usage | Close the loop between acting and adjusting using relevant outcome information. | 使用相关结果信息，闭合行动与调整之间的反馈回路。 | draft |
| distinctions | An observation becomes feedback when it enters a subsequent decision; collecting logs alone does not close a loop. | 观察信息进入后续决策后才成为反馈；仅收集日志无法闭合回路。 | draft |
| composition.pattern | Execution → Observation → Feedback → Adjustment | 执行 → 观察 → 反馈 → 调整 | draft |
| composition.example | A coding agent reads a failing test result and changes the implementation before running the relevant check again. | 编码智能体读取失败的测试结果，修改实现，再次运行相关检查。 | draft |
| considerations [0] | Prefer outcome evidence to self-reported confidence. | 优先使用结果证据，而非自报的信心。 | draft |
| considerations [1] | Account for delay and noisy signals before amplifying corrections. | 放大纠正动作前，应考虑延迟和信号噪声。 | draft |
| ownership.rationale | Instrumentation supplies results; code handles explicit responses and LLMs interpret bounded semantic feedback. | 检测与记录机制提供结果；代码处理明确响应，大语言模型解读范围受限的语义反馈。 | draft |
| priority.scope | Systems where action results can influence subsequent decisions. | 操作结果可以影响后续决策的系统。 | draft |
| priority.rationale | Systems cannot reliably correct their behavior unless actual outcomes influence what they do next. | 系统只有让实际结果影响后续行为，才能可靠地纠正自身行为。 | draft |

## Harness (harness)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | The runtime layer that coordinates AI reasoning with context, tools, state, permissions, and checks. | 协调 AI 推理与上下文、工具、状态、权限和检查的运行时层。 | reviewed |
| scope | AI agent runtimes coordinating model inference with tools, state, and operational controls. | 协调模型推理、工具、状态和运行控制的 AI 智能体运行时。 | reviewed |
| usage | Connect reasoning to bounded execution with inspectable state and outcomes. | 通过可检查的状态和结果，将推理连接到范围受限的执行。 | draft |
| distinctions | Harness is an AI runtime coordination layer, not a synonym for every runtime, framework, or tool collection. | Harness 是 AI 运行时的协调层，其含义不涵盖全部运行时、框架或工具集合。 | draft |
| composition.pattern | Context + Reasoning + Tools + Permissions + Verification → Agent Run | 上下文 + 推理 + 工具 + 权限 + 验证 → 智能体运行 | draft |
| composition.example | A coding runtime supplies relevant files, executes approved tools, captures results, and checks completion criteria. | 编码运行时提供相关文件、执行获准工具、记录结果，并检查完成标准。 | draft |
| considerations [0] | Keep the control layer small enough to inspect and replace. | 控制层应足够小，便于检查和替换。 | draft |
| considerations [1] | Remove model-specific workarounds when evidence shows they are no longer needed. | 当证据表明不再需要针对特定模型的变通措施时，删除这些措施。 | draft |
| ownership.rationale | Code owns state and enforcement; models supply bounded reasoning within the coordinated runtime. | 代码负责状态和执行约束；模型在协调后的运行时中提供范围受限的推理。 | draft |
| priority.scope | AI agent runtimes coordinating model inference with tools, state, and operational controls. | 协调模型推理、工具、状态和操作控制的 AI 智能体运行时。 | draft |
| priority.rationale | AI agent systems need an explicit runtime owner for coordination and enforcement that cannot be delegated to model output alone. | AI 智能体系统需要明确的运行时主体负责协调和执行约束，这些责任无法仅交给模型输出。 | draft |

## Memory (memory)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Information retained beyond the current step or session for possible retrieval and reuse. | 保留到当前步骤或会话之后，供后续检索和复用的信息。 | draft |
| scope | Tasks whose future decisions benefit from prior experience or retained facts. | 后续决策可从以往经验或已保留事实中受益的任务。 | draft |
| usage | Store useful experience outside the active context and retrieve it when relevant. | 在活动上下文之外保存有用经验，并在相关时检索。 | draft |
| distinctions | Memory is retained information; context is the subset currently available to reasoning. Working and long-term memory differ in lifetime and use. | 记忆是已保留的信息；上下文是其中当前可供推理使用的部分。工作记忆与长期记忆的区别在于生命周期和用途。 | draft |
| composition.pattern | Experience → Memory → Retrieval → Context | 经验 → 记忆 → 检索 → 上下文 | draft |
| composition.example | A research assistant saves an accepted terminology decision and retrieves it when drafting a later report. | 研究助手保存已接受的术语决策，并在起草后续报告时检索。 | draft |
| definitions.name | Memory | 记忆 | draft |
| definitions.text | Information retained across steps or sessions so that it can be retrieved and used again. | 跨步骤或会话保留的信息，可供再次检索和使用。 | draft |
| considerations [0] | Retained information can become stale or incorrect. | 保留的信息可能过时或有误。 | draft |
| considerations [1] | Give records update, provenance, and deletion rules rather than appending indefinitely. | 制定记录更新、来源追溯和删除规则，避免无限追加。 | draft |
| ownership.rationale | Storage and retrieval preserve records; LLMs may propose summaries and relevance judgments subject to review. | 存储和检索机制保留记录；大语言模型可提出摘要和相关性判断，随后需经过审阅。 | draft |
| priority.scope | Tasks whose future decisions benefit from prior experience or retained facts. | 后续决策可从以往经验或已保留事实中受益的任务。 | draft |
| priority.rationale | Retained memory is a strong default when later work needs prior facts or experience, but it requires deliberate freshness and lifecycle rules. | 当后续工作需要以往事实或经验时，保留记忆通常适用，但需要明确的时效性和生命周期规则。 | draft |

## Observation / Trace (observation-trace)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Information about actual conditions or outcomes, and connected records that make a run inspectable over time. | 关于实际条件或结果的信息，以及让长期运行过程可检查的关联记录。 | draft |
| scope | Systems needing evidence of actual behavior across individual actions and longer runs. | 需要单次操作及长期运行实际行为证据的系统。 | draft |
| usage | Record outcomes and their relationships so failures can be reconstructed. | 记录结果及其关系，以便重建故障过程。 | draft |
| distinctions | An observation captures information about a result or condition; a trace connects records across an execution. Neither automatically proves a claim. | 观察记录结果或条件的信息；追踪串联一次执行中的记录。两者都不会自动证明某项主张。 | draft |
| composition.pattern | Execution → Observation + Trace → Evidence | 执行 → 观察 + 追踪 → 证据 | draft |
| composition.example | A tool call records its request ID, result, timing, and parent task so a failed run can be inspected. | 工具调用记录请求 ID、结果、耗时和父任务，以便检查失败的运行。 | draft |
| considerations [0] | Logs may be incomplete, sampled, delayed, or sensitive. | 日志可能不完整、经过采样、延迟到达，或包含敏感内容。 | draft |
| considerations [1] | Record enough identity and ordering information to connect relevant steps. | 记录足够的身份和顺序信息，以关联相关步骤。 | draft |
| ownership.rationale | Instrumentation, logs, metrics, and trace stores capture behavior independently of model descriptions. | 检测与记录机制、日志、指标和追踪存储独立于模型描述捕获行为。 | draft |
| priority.scope | Systems needing evidence of actual behavior across individual actions and longer runs. | 需要单次操作及长期运行实际行为证据的系统。 | draft |
| priority.rationale | Actual behavior must be observable to diagnose failures, check completion, and reconstruct how a result arose. | 实际行为必须可观察，才能诊断故障、检查完成情况，并重建结果的形成过程。 | draft |

## Permission (permission)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | The authorization that determines which operations an actor may perform on which resources. | 决定某个主体可以对哪些资源执行哪些操作的授权。 | draft |
| scope | Systems where identities can read resources, invoke operations, or change state. | 具有身份的主体可以读取资源、调用操作或改变状态的系统。 | draft |
| usage | Make authorization explicit and enforce it at the point where effects occur. | 明确授权，并在影响实际发生的位置执行授权检查。 | draft |
| distinctions | Permission determines authorization. Guardrails are broader controls that may also constrain inputs, outputs, budgets, or behavior. | 权限决定授权；护栏的控制范围更广，也可约束输入、输出、预算或行为。 | draft |
| composition.pattern | Actor + Requested Action + Permission → Allow or Deny | 主体 + 请求的操作 + 权限 → 允许或拒绝 | draft |
| composition.example | An agent may read a repository but needs a separately authorized operation to publish a release. | 智能体可以读取仓库，但发布版本需要单独获准的操作。 | draft |
| considerations [0] | Model output cannot grant itself authorization. | 模型输出无法给自己授予权限。 | draft |
| considerations [1] | Scope credentials to the operation and resource actually needed. | 凭据范围应限定为实际需要的操作和资源。 | draft |
| ownership.rationale | Authentication, access checks, and runtime enforcement determine which actions may proceed. | 身份验证、访问检查和运行时执行约束决定哪些操作可以继续。 | draft |
| priority.scope | Systems where identities can read resources, invoke operations, or change state. | 具有身份的主体可以读取资源、调用操作或改变状态的系统。 | draft |
| priority.rationale | Any system capable of affecting resources must separate available capability from authorized action at the point of effect. | 任何能够影响资源的系统，都必须在影响发生的位置区分可用能力与已授权操作。 | draft |

## Reasoning (reasoning)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | The formation of interpretations and choices when information, meaning, or possible paths are not fully specified. | 信息、含义或可选路径尚未完全明确时，形成解释并作出选择的过程。 | draft |
| scope | AI agent systems handling semantic ambiguity, incomplete information, or open-ended choices. | 处理语义歧义、不完整信息或开放选择的 AI 智能体系统。 | draft |
| usage | Use model inference where selecting a useful action requires interpretation beyond fixed rules. | 当选择有效操作需要超出固定规则的解释时，使用模型推理。 | draft |
| distinctions | Reasoning proposes or interprets; execution produces effects and verification checks claims. Formal reasoning also exists outside LLMs. | 推理提出方案或解释；执行产生影响；验证检查主张。大语言模型之外也存在形式推理。 | draft |
| composition.pattern | Context + Goal → Reasoning → Proposed Plan | 上下文 + 目标 → 推理 → 提议计划 | draft |
| composition.example | A debugging agent compares symptoms and code to propose which hypothesis to test next. | 调试智能体比较症状和代码，提出下一步应检验的假设。 | draft |
| definitions.name | Reasoning | 推理 | draft |
| definitions.text | The process of forming interpretations and selecting possibilities from available information, especially when meaning or paths are not fully specified. | 基于可用信息形成解释并选择可能方案的过程，尤其适用于含义或路径尚未完全明确时。 | draft |
| considerations [0] | Generated explanations can be plausible and wrong. | 生成的解释可能看似合理但实际有误。 | draft |
| considerations [1] | Use fixed procedures when the decision is already fully specified. | 决策已完全明确时，使用固定过程。 | draft |
| ownership.rationale | LLMs are suitable for open-ended semantic inference; their conclusions remain proposals to be checked before consequential use. | 大语言模型适合开放式语义推理；其结论仍是提议，在产生重大影响前需检查。 | draft |
| priority.scope | AI agent systems handling semantic ambiguity, incomplete information, or open-ended choices. | 处理语义歧义、不完整信息或开放选择的 AI 智能体系统。 | draft |
| priority.rationale | Open-ended AI agent tasks require explicit reasoning responsibilities where fixed rules cannot fully specify the next useful action. | 开放式 AI 智能体任务需要明确推理责任，以处理固定规则无法完全规定下一项有效操作的情况。 | draft |

## Sandbox (sandbox)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | An execution environment that restricts access and effects to contain potentially unsafe operations. | 限制访问和影响，以约束潜在不安全操作的执行环境。 | draft |
| scope | Systems executing generated code, external tools, or other actions requiring containment. | 执行生成代码、外部工具或其他需要限制影响范围的操作的系统。 | draft |
| usage | Limit the reachable files, network, credentials, processes, and resource capacity of an operation. | 限制操作能够访问的文件、网络、凭据、进程和资源容量。 | draft |
| distinctions | A sandbox contains execution; permission establishes authorization. One does not replace the other. | 沙箱限制执行影响范围；权限确定授权。两者各自承担独立职责。 | draft |
| composition.pattern | Tool + Sandbox + Resource Limit → Bounded Execution | 工具 + 沙箱 + 资源限制 → 受限执行 | draft |
| composition.example | Generated analysis code runs with a temporary workspace, no production credentials, and a time limit. | 生成的分析代码在临时工作区中运行，不提供生产凭据，并设置时间限制。 | draft |
| definitions.name | Sandbox | 沙箱 | draft |
| definitions.text | An execution environment that restricts access and effects to contain potentially unsafe or untrusted operations. | 限制访问和影响，以约束潜在不安全或不可信操作的执行环境。 | draft |
| considerations [0] | Isolation has specific boundaries and does not prove an operation is harmless. | 隔离具有明确边界，不能证明某项操作无害。 | draft |
| considerations [1] | Control network and credentials as well as the filesystem. | 除文件系统外，还应控制网络和凭据。 | draft |
| ownership.rationale | Operating-system and infrastructure controls impose execution boundaries independently of model compliance. | 操作系统和基础设施控制独立于模型的遵从行为，施加执行边界。 | draft |
| priority.scope | Systems executing generated code, external tools, or other actions requiring containment. | 执行生成代码、外部工具或其他需要限制影响范围的操作的系统。 | draft |
| priority.rationale | Sandboxing is a strong default when generated or untrusted actions need containment beyond ordinary application-level authorization. | 当生成或不可信操作需要超出普通应用授权的影响限制时，通常应采用沙箱。 | draft |

## Session (session)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | A task lifecycle with an identity and retained progress that connects operations across time. | 具有身份并保留进度，在时间上串联各项操作的任务生命周期。 | draft |
| scope | Long-running or resumable agent tasks; this entry uses a durable task-session interpretation. | 长期运行或可恢复的智能体任务；本条目采用持久任务会话的解释。 | draft |
| usage | Keep task identity and recoverable progress separate from the current model input. | 将任务身份和可恢复进度与当前模型输入分开。 | draft |
| distinctions | Session is a lifecycle container; context is current input. Not every implementation uses an event log or supports durable recovery. | 会话是生命周期容器；上下文是当前输入。并非每种实现都使用事件日志或支持持久恢复。 | draft |
| composition.pattern | Session Identity + Retained State + Event History → Resume | 会话身份 + 已保留状态 + 事件历史 → 恢复 | draft |
| composition.example | A research task resumes after interruption using its accepted outline, completed searches, and pending work. | 研究任务中断后，使用已接受大纲、已完成搜索和待办工作恢复。 | draft |
| definitions.name | Session | 会话 | draft |
| definitions.text | A bounded task lifecycle with an identity and retained progress that allows related interactions and operations to be coordinated over time. | 具有身份和已保留进度的有限任务生命周期，使相关交互和操作可在时间上协调。 | draft |
| considerations [0] | A full history should not be copied into every model context. | 不应在每次模型上下文中复制完整历史。 | draft |
| considerations [1] | Specify retention and concurrent ownership of session state. | 明确会话状态的保留规则和并发责任归属。 | draft |
| ownership.rationale | Persistent records and lifecycle management preserve identity and recovery points across interactions. | 持久记录和生命周期管理在多次交互之间保留身份与恢复点。 | draft |
| priority.scope | Long-running or resumable agent tasks; this entry uses a durable task-session interpretation. | 长期运行或可恢复的智能体任务；本条目采用持久任务会话的解释。 | draft |
| priority.rationale | Long-running or resumable tasks need explicit session identity and lifecycle rules to preserve continuity beyond a single model interaction. | 长期运行或可恢复的任务需要明确的会话身份和生命周期规则，以保持单次模型交互之外的连续性。 | draft |

## Verification / Evaluation (verification-evaluation)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Checks of particular requirements and assessments of broader quality or performance using selected evidence and criteria. | 依据选定证据和标准，检查具体要求并评估更广泛的质量或性能。 | draft |
| scope | Systems that need defensible judgments about individual results or broader quality. | 需要对单个结果或整体质量作出有依据判断的系统。 | draft |
| usage | Compare evidence with explicit criteria before claiming success or adopting changes. | 在宣称成功或采用变更前，将证据与明确标准比较。 | draft |
| distinctions | Verification checks a particular requirement or result; evaluation assesses quality or performance under a chosen methodology. | 验证检查某个具体要求或结果；评估按照选定方法判断质量或性能。 | draft |
| composition.pattern | Evidence + Criteria + Invariants → Verdict | 证据 + 标准 + 不变量 → 判定 | draft |
| composition.example | A report pipeline checks required source links mechanically and evaluates answer relevance on a representative query set. | 报告流水线通过机械检查验证必要来源链接，并在代表性查询集上评估答案相关性。 | draft |
| considerations [0] | Passing structural checks does not establish semantic correctness. | 通过结构检查不能证明语义正确。 | draft |
| considerations [1] | An aggregate quality score does not verify every individual result. | 汇总质量分数无法验证每个单独结果。 | draft |
| ownership.rationale | Code performs formal checks; LLMs can assist semantic assessment with explicit criteria, evidence, and appropriate review. | 代码执行形式检查；大语言模型可按照明确标准、证据和适当审阅协助语义评估。 | draft |
| priority.scope | Systems that need defensible judgments about individual results or broader quality. | 需要对单个结果或整体质量作出有依据判断的系统。 | draft |
| priority.rationale | Systems need an explicit basis for judging results so that plausible output and aggregate scores do not masquerade as verified success. | 系统需要明确的结果判断依据，避免把看似合理的输出和汇总分数误当作已验证成功。 | draft |
