# Remaining primitive translations

All rows are new drafts. Canonical English is the translation source. The previous approved batch is excluded from this comparison.

## Actor / Agent (actor)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | An identifiable participant that can perceive, decide, or act; an agent has delegated discretion toward a goal. | 能够感知、决策或行动的可识别参与者；智能体则具有围绕目标的委派裁量权。 |
| scope | Systems where actions have identifiable performers and authority. | 操作具有可识别执行者和权限的系统。 |
| usage | Connect each action to a responsible participant, available capability, and permission. | 将每项操作关联到负责主体、可用能力和权限。 |
| distinctions | Agent is a specialized actor, not a synonym for every user, service, or organization. | 智能体是一类专门的行动主体，不能将其等同于全部用户、服务或组织。 |
| composition.pattern | Actor + Capability + Permission → Execution | 主体 + 能力 + 权限 → 执行 |
| composition.example | A research agent can search documents while a publishing service alone can release the approved report. | 研究智能体可以搜索文档，而只有发布服务能够发布已批准报告。 |
| definitions.name [0] | Actor | 行动主体 |
| definitions.name [1] | Agent | 智能体 |
| definitions.text [0] | An identifiable participant capable of perceiving, deciding, or performing actions within a system. | 系统中能够感知、决策或执行操作的可识别参与者。 |
| definitions.text [1] | An actor delegated some capacity to select and pursue actions toward a goal within specified limits. | 在规定限制内获委派权限，可以围绕目标选择并推进操作的行动主体。 |
| considerations [0] | Having a capability does not establish permission. | 具有能力不意味着具有权限。 |
| considerations [1] | Keep technical identity and human accountability explicit. | 明确技术身份和人的责任。 |
| ownership.rationale | Models may propose actions; authenticated services execute within assigned permissions and record the actor identity. | 模型可提出操作；经过身份验证的服务在分配权限内执行，并记录主体身份。 |
| priority.scope | Systems where actions have identifiable performers and authority. | 操作具有可识别执行者和权限的系统。 |
| priority.rationale | Systems with multiple performers need explicit actors to assign capabilities, permissions, and responsibility without conflating them. | 具有多个执行者的系统需要明确主体，以便分配能力、权限和责任，并避免混淆。 |

## Adaptation / Learning (adaptation-learning)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Changes made in response to conditions or experience, including retained changes to knowledge and future behavior. | 因条件或经验而作出的变化，包括对知识和未来行为的持久改变。 |
| scope | Systems expected to improve or adjust across repeated experience. | 预期通过重复经验改善或调整的系统。 |
| usage | Turn observed outcomes into controlled changes with measurable effects. | 将观察结果转化为受控且影响可测量的变更。 |
| distinctions | Adaptation can be a temporary response; learning implies a retained change. Neither necessarily requires modifying model weights. | 适应可以是暂时响应；学习意味着持久变化。两者都不一定需要修改模型权重。 |
| composition.pattern | Feedback → Learning → Model or Policy Update | 反馈 → 学习 → 模型或策略更新 |
| composition.example | A retrieval service evaluates missed answers, proposes a ranking change, and checks it on held-out queries before adoption. | 检索服务评估未能回答的问题，提出排序变更，并在采用前用留出查询检查。 |
| definitions.name [0] | Adaptation | 适应 |
| definitions.name [1] | Learning | 学习 |
| definitions.text [0] | A change in behavior or configuration in response to conditions or experience. | 针对条件或经验改变行为或配置。 |
| definitions.text [1] | A process in which experience produces a retained change in knowledge, a model, or future behavior. | 经验使知识、模型或未来行为产生持久改变的过程。 |
| considerations [0] | A reflective explanation does not establish that behavior improved. | 反思性解释不能证明行为已经改善。 |
| considerations [1] | Separate proposing an update from authorizing and deploying it. | 将提出更新与授权、部署更新分开。 |
| ownership.rationale | LLMs may infer candidate changes; versioned updates, evaluation, and deployment controls govern adoption. | 大语言模型可推断候选变更；具有版本的更新、评估和部署控制决定是否采用。 |
| priority.scope | Systems expected to improve or adjust across repeated experience. | 预期通过重复经验改善或调整的系统。 |
| priority.rationale | Systems expected to improve across experience should explicitly govern what changes, how improvement is measured, and when changes are adopted. | 预期通过经验改善的系统应明确管理改变什么、如何测量改进，以及何时采用变更。 |

## Affordance / Signifier (affordance-signifier)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The actions available to an actor and the perceivable cues that help the actor discover them. | 主体可以采取的行动，以及帮助发现行动的可感知提示。 |
| scope | Interfaces through which people or agents discover available actions. | 人或智能体通过其发现可用操作的界面。 |
| usage | Make supported actions discoverable and align cues with actual behavior. | 使受支持操作能够被发现，并让提示符合实际行为。 |
| distinctions | Affordance concerns the possible action; signifier concerns the cue that makes it discoverable. | 可供性关注可能采取的行动；指示符关注让行动能够被发现的提示。 |
| composition.pattern | Capability + Signifier → Discoverable Action | 能力 + 指示符 → 可发现行动 |
| composition.example | A visible Resume control points to a real resumable task, while tool documentation tells an agent which resume operation to call. | 可见的恢复控件指向真正可恢复的任务；工具文档则说明智能体应调用哪项恢复操作。 |
| definitions.name [0] | Affordance | 可供性 |
| definitions.name [1] | Signifier | 指示符 |
| definitions.text [0] | An action possibility arising from the relationship between an actor and its environment or interface. | 主体与环境或界面的关系所产生的行动可能性。 |
| definitions.text [1] | A perceivable cue that communicates where or how an action can be taken. | 传达可在何处或如何采取行动的可感知提示。 |
| considerations [0] | A visible cue does not guarantee an action is available or authorized. | 可见提示不能保证操作可用或已获授权。 |
| considerations [1] | Explain disabled or conditional actions instead of inviting impossible attempts. | 解释禁用或有条件的操作，避免诱导无法执行的尝试。 |
| ownership.rationale | Interface code implements actions and availability; LLMs can help explain options in context. | 界面代码实现操作及其可用性；大语言模型可帮助结合上下文解释选项。 |
| priority.scope | Interfaces through which people or agents discover available actions. | 人或智能体通过其发现可用操作的界面。 |
| priority.rationale | Interfaces should explicitly connect action possibilities to understandable cues when people or agents must discover how to proceed. | 人或智能体需要发现下一步方法时，界面应明确连接行动可能性与易理解提示。 |

## Boundary / Environment (boundary-environment)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The separation that defines a system, together with the external conditions and participants that influence it. | 定义系统范围的分界，以及影响系统的外部条件和参与者。 |
| scope | Any system described relative to an explicit design or operational scope. | 根据明确设计或运行范围描述的任何系统。 |
| usage | Expose dependencies and exchanges that the system cannot fully control. | 呈现系统无法完全控制的依赖与交换。 |
| distinctions | Boundary is the separation; environment is what lies beyond it. A sandbox is one mechanism for enforcing selected boundaries. | 边界是分界；环境是边界外的内容。沙箱是执行某些边界约束的一种机制。 |
| composition.pattern | Boundary → Interface; Environment → Constraint | 边界 → 接口；环境 → 约束 |
| composition.example | A document agent controls its local workspace but depends on an external search service with separate latency and access rules. | 文档智能体控制本地工作区，但依赖具有独立延迟和访问规则的外部搜索服务。 |
| definitions.name [0] | Boundary | 边界 |
| definitions.name [1] | Environment | 环境 |
| definitions.text [0] | A chosen separation that identifies what belongs to a system and where exchanges with other systems occur. | 选定的分界，说明哪些内容属于系统，以及系统间在何处交换。 |
| definitions.text [1] | The external conditions and participants that affect a system but lie outside its chosen boundary. | 影响系统、但处于选定边界之外的外部条件和参与者。 |
| considerations [0] | Revisit the boundary when responsibilities change. | 责任变化时重新检查边界。 |
| considerations [1] | A diagrammed boundary does not enforce an execution restriction. | 图中画出的边界不会强制实施执行限制。 |
| ownership.rationale | LLMs can help frame scope; software interfaces and runtime restrictions implement the accepted boundary. | 大语言模型可帮助界定范围；软件接口和运行时限制实现已接受边界。 |
| priority.scope | Any system described relative to an explicit design or operational scope. | 根据明确设计或运行范围描述的任何系统。 |
| priority.rationale | Every design depends on what it controls, what it excludes, and how it exchanges information or effects with its surroundings. | 每项设计都依赖它控制什么、排除什么，以及如何与周边交换信息或影响。 |

## Buffer / Queue (buffer-queue)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Temporary holding capacity and ordering structures that separate production from later processing. | 暂存容量和排序结构，将生产与后续处理分开。 |
| scope | Systems with bursty arrivals, asynchronous processing, or unequal processing rates. | 具有突发到达、异步处理或处理速率不一致的系统。 |
| usage | Absorb short-term variation while exposing backlog and admission limits. | 吸收短期变化，同时呈现积压和准入限制。 |
| distinctions | A queue is an organized form of buffering; not every buffer is first-in-first-out. | 队列是有组织的缓冲形式；并非每种缓冲都遵循先进先出。 |
| composition.pattern | Producer → Buffer → Consumer | 生产者 → 缓冲 → 消费者 |
| composition.example | A batch of document requests waits in a bounded queue before model workers process it. | 一批文档请求先在有界队列中等待，再由模型工作者处理。 |
| definitions.name [0] | Buffer | 缓冲 |
| definitions.name [1] | Queue | 队列 |
| definitions.text [0] | Temporary capacity that holds work or data between producers and consumers with different rates. | 在速率不同的生产者与消费者之间暂存工作或数据的容量。 |
| definitions.text [1] | A structure that organizes pending items for later processing under an explicit selection order. | 按明确选择顺序组织待处理项目的结构。 |
| considerations [0] | Bound capacity and define overload behavior. | 限定容量并规定过载处理方式。 |
| considerations [1] | More buffering can hide inadequate capacity and increase waiting time. | 更多缓冲可能掩盖容量不足，并增加等待时间。 |
| ownership.rationale | Queue services and runtime code own ordering, limits, retries, and acknowledgement semantics. | 队列服务和运行时代码负责排序、限制、重试和确认语义。 |
| priority.scope | Systems with bursty arrivals, asynchronous processing, or unequal processing rates. | 具有突发到达、异步处理或处理速率不一致的系统。 |
| priority.rationale | Buffers and queues should be explicit when unequal rates or bursty arrivals create waiting, overload, or ordering requirements. | 当速率不一致或突发到达造成等待、过载或排序要求时，应明确建模缓冲与队列。 |

## Constraint (constraint)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | An explicit limit on which solutions, actions, or states are acceptable. | 明确限制哪些方案、行动或状态可接受的条件。 |
| scope | Systems with limits on behavior, resources, outputs, or acceptable outcomes. | 对行为、资源、输出或可接受结果有限制的系统。 |
| usage | Eliminate inadmissible choices before execution or commitment. | 在执行或承诺之前排除不允许的选择。 |
| distinctions | A constraint limits the feasible space; an invariant is a property required to remain true across specified transitions. | 约束限制可行空间；不变量是在规定转换中必须保持为真的属性。 |
| composition.pattern | Goal + Constraint → Feasible Action | 目标 + 约束 → 可行行动 |
| composition.example | An agent may summarize private files but cannot send their contents to an external service. | 智能体可以总结私有文件，但不能将内容发送给外部服务。 |
| definitions.name | Constraint | 约束 |
| definitions.text | A condition that limits which solutions, actions, or states are admissible. | 限制哪些方案、行动或状态被允许的条件。 |
| considerations [0] | Express enforceable constraints as checks at the point of effect. | 将可执行约束表达为在影响发生点实施的检查。 |
| considerations [1] | A natural-language restriction alone is not an enforcement mechanism. | 仅用自然语言表述限制不能构成执行约束机制。 |
| ownership.rationale | Code, policies, budgets, and access checks enforce formalizable restrictions; uncertain interpretation should be resolved before commitment. | 代码、策略、预算和访问检查执行可形式化的限制；不确定解释应在承诺前解决。 |
| priority.scope | Systems with limits on behavior, resources, outputs, or acceptable outcomes. | 对行为、资源、输出或可接受结果有限制的系统。 |
| priority.rationale | A design cannot identify admissible actions without accounting for the conditions that rule actions out. | 设计必须考虑排除某些行动的条件，才能识别允许的行动。 |

## Control (control)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The selection of interventions using observations and desired conditions to regulate behavior. | 结合观察与期望条件选择干预措施，以调节行为。 |
| scope | Systems requiring correction, stabilization, or bounded progress toward a goal. | 需要纠正、稳定或在边界内向目标推进的系统。 |
| usage | Define what is measured, what can be changed, and when intervention occurs. | 定义测量什么、可以改变什么，以及何时干预。 |
| distinctions | Feedback supplies information; control uses information and a reference condition to intervene. | 反馈提供信息；控制利用信息和参考条件实施干预。 |
| composition.pattern | Goal + Observation → Controller → Action | 目标 + 观察 → 控制器 → 行动 |
| composition.example | A runtime stops new agent calls when spending approaches the accepted budget. | 支出接近已接受预算时，运行时停止新的智能体调用。 |
| definitions.name | Control | 控制 |
| definitions.text | The use of observations and desired conditions to select interventions that regulate system behavior. | 利用观察与期望条件选择干预措施，以调节系统行为。 |
| considerations [0] | Delayed or excessive correction can destabilize the process. | 延迟或过度纠正可能使过程不稳定。 |
| considerations [1] | Specify escalation when the controller lacks an effective response. | 控制器缺少有效响应时，规定升级措施。 |
| ownership.rationale | Runtime rules and controllers enforce predictable intervention; models can advise within explicit limits. | 运行时规则和控制器实施可预测干预；模型可在明确限制内提出建议。 |
| priority.scope | Systems requiring correction, stabilization, or bounded progress toward a goal. | 需要纠正、稳定或在边界内向目标推进的系统。 |
| priority.rationale | Systems that must maintain limits or progress toward a reference condition need explicit intervention rules rather than observation alone. | 需要维持限制或向参考条件推进的系统，需要明确干预规则，仅观察信息并不足够。 |

## Delay (delay)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The lag between an action, its effects, and the availability of information about those effects. | 行动、其影响及相关影响信息可用之间的时间滞后。 |
| scope | Systems with asynchronous effects, waiting, or feedback loops. | 具有异步影响、等待或反馈回路的系统。 |
| usage | Account for lag before interpreting missing results or issuing corrective actions. | 解释缺少结果或发出纠正行动前，应考虑滞后。 |
| distinctions | Delay is elapsed lag; a time budget is a constraint on a resource. | 延迟是经过的滞后时间；时间预算是资源约束。 |
| composition.pattern | Action → Delay → Observation → Feedback | 行动 → 延迟 → 观察 → 反馈 |
| composition.example | A deployment agent waits for health signals to settle before judging a rollout unsuccessful. | 部署智能体等待健康信号稳定后，再判断发布是否失败。 |
| definitions.name | Delay | 延迟 |
| definitions.text | Elapsed time between an action, a resulting change, and the availability of information about that change. | 行动、由此产生的变化及有关变化的信息可用之间经过的时间。 |
| considerations [0] | Repeated correction before effects arrive can cause oscillation. | 影响到达之前反复纠正可能造成振荡。 |
| considerations [1] | Separate processing time, queue time, and observation lag when diagnosing delays. | 诊断延迟时区分处理时间、排队时间和观察滞后。 |
| ownership.rationale | Timers, timestamps, scheduling, and timeout policies measure and handle lag. | 定时器、时间戳、调度和超时策略测量并处理滞后。 |
| priority.scope | Systems with asynchronous effects, waiting, or feedback loops. | 具有异步影响、等待或反馈回路的系统。 |
| priority.rationale | Systems with asynchronous effects need explicit delay assumptions to avoid premature failure judgments and excessive correction. | 具有异步影响的系统需要明确延迟假设，以避免过早判断失败和过度纠正。 |

## Emergence (emergence)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Collective behavior arising from interactions that is not apparent from examining a component in isolation. | 由相互作用产生、单独检查一个组件时不明显的集体行为。 |
| scope | Complex or multi-agent systems with significant interaction effects. | 具有显著交互影响的复杂系统或多智能体系统。 |
| usage | Investigate collective patterns through observations and experiments rather than assuming local correctness guarantees global behavior. | 通过观察与实验调查集体模式，避免假定局部正确能够保证全局行为。 |
| distinctions | Emergence describes a system-level phenomenon; it is not a callable runtime component or proof of intelligence. | 涌现描述系统层面现象，既非可调用的运行时组件，也不能证明智能。 |
| composition.pattern | Local Rules + Relations + Repeated Interaction → System-Level Pattern | 局部规则 + 关系 + 重复交互 → 系统层面模式 |
| composition.example | Several individually reasonable agents repeatedly duplicate searches because their local coordination rules fail to expose ownership. | 多个单独看似合理的智能体反复重复搜索，因为局部协调规则未呈现责任归属。 |
| definitions.name | Emergence | 涌现 |
| definitions.text | System-level behavior produced through interactions among components that is not apparent from examining a component in isolation. | 组件交互产生的系统层面行为，单独检查某个组件时无法明显看出。 |
| considerations [0] | Use emergence as an analytical lens, not an excuse for unexplained behavior. | 将涌现用作分析视角，避免用它替代对行为的解释。 |
| considerations [1] | Test competing explanations against measured interaction patterns. | 根据测得的交互模式检验不同解释。 |
| ownership.rationale | LLMs can suggest cross-component explanations; instrumentation and experiments are still needed to establish what actually occurs. | 大语言模型可提出跨组件解释；仍需检测记录与实验确定实际情况。 |
| priority.scope | Complex or multi-agent systems with significant interaction effects. | 具有显著交互影响的复杂系统或多智能体系统。 |
| priority.rationale | Emergence becomes a first-class concern when interacting components produce consequential patterns that local component checks cannot explain. | 相互作用的组件产生重大模式，且局部组件检查无法解释时，涌现应成为明确关注点。 |

## Entity (entity)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | An object whose stable identity allows it to be referenced as its attributes and state change. | 通过稳定身份，可在属性和状态变化过程中持续被引用的对象。 |
| scope | Systems that track persistent objects and their relationships. | 跟踪持久对象及其关系的系统。 |
| usage | Give durable work objects stable identities rather than relying on changing descriptions. | 为持久工作对象提供稳定身份，避免依赖不断变化的描述。 |
| distinctions | An entity persists through state changes; a view presents selected information about it. | 实体在状态变化后仍保持身份；视图呈现实体现有信息中的选定部分。 |
| composition.pattern | Entity + Relation + State | 实体 + 关系 + 状态 |
| composition.example | A report retains its report ID across drafts, approvals, and publication events. | 报告在草稿、批准和发布事件中保留同一个报告 ID。 |
| definitions.name | Entity | 实体 |
| definitions.text | An object with a stable identity that can be referenced across changes to its attributes or state. | 具有稳定身份、可在属性或状态变化过程中被引用的对象。 |
| considerations [0] | Do not create a new entity for every presentation of the same object. | 同一对象的每种呈现无需各自创建新实体。 |
| considerations [1] | Choose identity and lifecycle rules before spreading references. | 广泛建立引用前，先确定身份与生命周期规则。 |
| ownership.rationale | Databases and typed records preserve identity, references, and lifecycle rules. | 数据库和带类型记录保留身份、引用和生命周期规则。 |
| priority.scope | Systems that track persistent objects and their relationships. | 跟踪持久对象及其关系的系统。 |
| priority.rationale | Systems tracking persistent objects need identity rules to distinguish a changed object from a different object. | 跟踪持久对象的系统需要身份规则，以区分对象变化与不同对象。 |

## Event (event)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A significant occurrence distinguished from the interpretation or observation of that occurrence. | 需要与对其解释或观察区分开的重要发生事项。 |
| scope | Systems that react to changes or need a history of meaningful occurrences. | 响应变化或需要重要发生事项历史的系统。 |
| usage | Drive transitions from recorded facts rather than inferred narrative progress. | 根据记录事实驱动转换，避免仅从叙述推断进度。 |
| distinctions | An event is an occurrence; an observation is information obtained about it, and a trace relates multiple recorded steps. | 事件是发生事项；观察是获得的相关信息；追踪关联多个已记录步骤。 |
| composition.pattern | Event → Rule → State Transition | 事件 → 规则 → 状态转换 |
| composition.example | A tool-completed event records the job identifier, completion time, and result location. | 工具完成事件记录任务标识、完成时间和结果位置。 |
| definitions.name | Event | 事件 |
| definitions.text | A fact that something significant occurred at an identifiable point or interval in time. | 某个重要事项在可识别时间点或时间区间发生的事实。 |
| considerations [0] | Separate the occurrence from an interpretation of its cause. | 区分发生事项与对其原因的解释。 |
| considerations [1] | Delivery order and duplication may differ from occurrence order. | 交付顺序和重复情况可能与发生顺序不同。 |
| ownership.rationale | Runtime instrumentation and event stores capture occurrences with identifiers and timestamps. | 运行时检测与记录机制及事件存储，使用标识符和时间戳记录发生事项。 |
| priority.scope | Systems that react to changes or need a history of meaningful occurrences. | 响应变化或需要重要发生事项历史的系统。 |
| priority.rationale | Systems reacting to change need identifiable occurrences to explain transitions and separate actual events from inferred progress. | 响应变化的系统需要可识别发生事项，以解释转换并区分实际事件与推断进度。 |

## Evidence (evidence)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Traceable information used to support or challenge a particular claim. | 用来支持或质疑某项具体主张的可追溯信息。 |
| scope | Systems making claims, acceptance decisions, or consequential changes that need inspectable support. | 提出主张、作出验收决策或重大变更，且需要可检查支撑的系统。 |
| usage | Attach relevant, traceable support to a specific claim rather than relying on confident wording. | 为具体主张提供相关且可追溯的支撑，减少对自信措辞的依赖。 |
| distinctions | Observation is obtained information; evidence is information used to support or challenge a claim. Verification uses it to judge a requirement. | 观察是获得的信息；证据是用于支持或质疑主张的信息。验证使用证据判断要求是否满足。 |
| composition.pattern | Observation + Claim + Provenance → Evidence → Verification | 观察 + 主张 + 来源 → 证据 → 验证 |
| composition.example | A test result tied to the tested commit supports a claim about that commit, not a later untested revision. | 关联到被测试提交的结果，仅支撑有关该提交的主张，无法证明后续未测试修订。 |
| considerations [0] | Check relevance, freshness, and provenance before reusing evidence. | 复用证据前检查相关性、时效性和来源。 |
| considerations [1] | Absence of recorded failure is not proof of success. | 没有记录到失败不能证明成功。 |
| ownership.rationale | Software captures and retains source records; LLMs help interpret relevance while conclusions remain tied to inspectable support. | 软件捕获并保留来源记录；大语言模型协助解释相关性，结论仍需连接可检查支撑。 |
| priority.scope | Systems making claims, acceptance decisions, or consequential changes that need inspectable support. | 提出主张、作出验收决策或重大变更，且需要可检查支撑的系统。 |
| priority.rationale | Claims and acceptance decisions need inspectable support to distinguish demonstrated outcomes from confident descriptions. | 主张和验收决策需要可检查支撑，以区分已展示结果与自信描述。 |

## Flow (flow)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The movement of information, work, material, or value through a system over time. | 信息、工作、物料或价值随时间在系统中的移动。 |
| scope | Systems that transfer or transform work and information across stages. | 跨阶段传递或转换工作与信息的系统。 |
| usage | Find bottlenecks by following end-to-end movement rather than optimizing isolated steps. | 沿端到端流动寻找瓶颈，避免仅优化孤立步骤。 |
| distinctions | A flow describes movement; a workflow specifies an organized sequence of activities that may carry that flow. | 流描述移动；工作流规定可能承载该流的有组织活动顺序。 |
| composition.pattern | Source → Transform → Sink | 来源 → 转换 → 汇点 |
| composition.example | User requests pass through intake, retrieval, generation, review, and delivery. | 用户请求经过接收、检索、生成、审阅和交付。 |
| definitions.name | Flow | 流 |
| definitions.text | Movement of information, work, material, or value between parts of a system over time. | 信息、工作、物料或价值随时间在系统各部分间移动。 |
| considerations [0] | Faster generation can worsen a downstream review backlog. | 加快生成可能恶化下游审阅积压。 |
| considerations [1] | Track flow rate together with failure and waiting time. | 结合故障和等待时间跟踪流速。 |
| ownership.rationale | Pipelines, schedulers, and transport mechanisms implement and measure transfers. | 流水线、调度器和传输机制实现并测量传递过程。 |
| priority.scope | Systems that transfer or transform work and information across stages. | 跨阶段传递或转换工作与信息的系统。 |
| priority.rationale | End-to-end movement determines whether local processing actually delivers useful results and where bottlenecks accumulate. | 端到端流动决定局部处理能否交付有用结果，以及瓶颈在何处累积。 |

## Goal (goal)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The desired result that gives a task or system a concrete direction and a basis for stopping. | 为任务或系统提供具体方向和停止依据的期望结果。 |
| scope | Goal-directed tasks and systems with an intended outcome. | 具有预期结果的目标导向任务和系统。 |
| usage | Name the result to pursue so plans and stopping decisions have a stable reference. | 明确要追求的结果，使计划和停止决策具有稳定参考。 |
| distinctions | Purpose explains why the work matters; goal specifies the desired result and success criteria determine how attainment is judged. | 目的说明工作为何重要；目标规定期望结果；成功标准决定如何判断目标达成。 |
| composition.pattern | Purpose → Goal → Plan + Success Criterion | 目的 → 目标 → 计划 + 成功标准 |
| composition.example | A research task aims to deliver a source-backed comparison of three architectures within the agreed scope. | 研究任务的目标是在约定范围内交付三种架构的有来源支撑的比较。 |
| considerations [0] | An agent should not silently replace the accepted goal with an easier proxy. | 智能体不应悄然用更容易的代理目标替换已接受目标。 |
| considerations [1] | Resolve conflicting goals with the responsible people. | 与负责人员解决目标冲突。 |
| ownership.rationale | People authorize intended outcomes; LLMs help clarify them and software preserves accepted goals and completion conditions. | 人授权预期结果；大语言模型协助澄清，软件保留已接受目标和完成条件。 |
| priority.scope | Goal-directed tasks and systems with an intended outcome. | 具有预期结果的目标导向任务和系统。 |
| priority.rationale | Goal-directed work needs an explicit intended result to align plans, resolve drift, and judge when further action is unnecessary. | 目标导向工作需要明确预期结果，以对齐计划、解决偏移，并判断何时无需继续行动。 |

## Hierarchy (hierarchy)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A nested or ordered arrangement of units that separates levels of responsibility or abstraction. | 通过嵌套或有序单元分开责任层次或抽象层次的组织方式。 |
| scope | Systems whose complexity benefits from decomposition into levels. | 复杂性可通过分层分解降低的系统。 |
| usage | Localize reasoning and changes while making cross-level dependencies explicit. | 局部化推理和变更，同时明确跨层依赖。 |
| distinctions | Hierarchy describes organization; a plan describes intended actions and their dependencies. | 层级描述组织；计划描述预期行动及依赖。 |
| composition.pattern | System → Subsystem → Module | 系统 → 子系统 → 模块 |
| composition.example | A research task contains evidence-gathering workstreams, each with bounded retrieval steps. | 研究任务包含多个证据收集工作流，各自具有范围受限的检索步骤。 |
| definitions.name | Hierarchy | 层级 |
| definitions.text | An arrangement of nested or ordered units that separates levels of responsibility or abstraction. | 通过嵌套或有序单元分开责任或抽象层次的组织方式。 |
| considerations [0] | A tree is misleading when shared dependencies dominate. | 共享依赖占主导时，树状图可能误导。 |
| considerations [1] | Delegation depth does not remove accountability at higher levels. | 委派层数增加不会消除上层责任。 |
| ownership.rationale | LLMs can suggest decompositions; explicit ownership and dependency records govern execution. | 大语言模型可提出分解方案；明确的责任和依赖记录管理执行。 |
| priority.scope | Systems whose complexity benefits from decomposition into levels. | 复杂性可通过分层分解降低的系统。 |
| priority.rationale | Hierarchies help when decomposition localizes decisions, but deserve explicit modeling only where the resulting levels clarify real dependencies. | 分解能局部化决策时，层级有帮助；只有形成的层次能澄清实际依赖时，才值得明确建模。 |

## Interface (interface)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A contract describing how system units exchange inputs, outputs, effects, and obligations. | 描述系统单元如何交换输入、输出、影响和义务的契约。 |
| scope | Systems composed of interacting components or external services. | 由交互组件或外部服务构成的系统。 |
| usage | Expose a small stable contract while allowing internal implementation changes. | 提供小而稳定的契约，同时允许内部实现变化。 |
| distinctions | An interface defines an exchange contract; a module contains the implementation behind it. | 接口定义交换契约；模块包含接口背后的实现。 |
| composition.pattern | Module ↔ Interface ↔ Module | 模块 ↔ 接口 ↔ 模块 |
| composition.example | A retrieval tool accepts a query and returns passages with source identifiers and a stated failure format. | 检索工具接收查询，并返回带来源标识的片段及明确的失败格式。 |
| definitions.name | Interface | 接口 |
| definitions.text | An explicit contract governing how system units exchange inputs, outputs, and obligations. | 管理系统单元如何交换输入、输出和义务的明确契约。 |
| considerations [0] | Include errors and side effects, not only successful output shapes. | 除成功输出形状外，还应包含错误和副作用。 |
| considerations [1] | Exposing internal details increases coupling and caller burden. | 暴露内部细节会增加耦合与调用方负担。 |
| ownership.rationale | Schemas, APIs, validation, and protocol implementations make the contract executable. | Schema、API、验证和协议实现使契约可执行。 |
| priority.scope | Systems composed of interacting components or external services. | 由交互组件或外部服务构成的系统。 |
| priority.rationale | Interacting units need explicit contracts to coordinate behavior and detect incompatible assumptions at their boundaries. | 相互作用的单元需要明确契约，以协调行为并在边界发现不兼容假设。 |

## Invariant (invariant)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A property that must remain true across the states and transitions included in its scope. | 在适用范围内的状态与转换中必须保持为真的属性。 |
| scope | Stateful systems with correctness or safety conditions that must survive every allowed transition. | 正确性或安全条件必须经受每个允许转换的有状态系统。 |
| usage | Preserve essential properties while allowing implementations to vary. | 保留必要属性，同时允许实现方式变化。 |
| distinctions | An invariant is a persistent property; verification is an activity used to assess whether it holds. | 不变量是持续成立的属性；验证是用于评估其是否成立的活动。 |
| composition.pattern | Proposed Transition → Invariant Check → Commit | 提议转换 → 不变量检查 → 提交 |
| composition.example | A task may be marked complete only when its required evidence references remain resolvable. | 只有必要证据引用仍可解析时，任务才能标记完成。 |
| definitions.name | Invariant | 不变量 |
| definitions.text | A property required to remain true throughout a specified set of system states or transitions. | 在规定系统状态或转换集合中，要求始终保持为真的属性。 |
| considerations [0] | State the transitions over which the property must hold. | 明确该属性必须在哪些转换中成立。 |
| considerations [1] | Check-then-write races can invalidate a previously successful check. | 先检查后写入的竞态可能使原本成功的检查失效。 |
| ownership.rationale | Transactions, state machines, constraints, and checks maintain machine-checkable properties at transition boundaries. | 事务、状态机、约束和检查在转换边界维持可机器检查的属性。 |
| priority.scope | Stateful systems with correctness or safety conditions that must survive every allowed transition. | 正确性或安全条件必须经受每个允许转换的有状态系统。 |
| priority.rationale | Stateful systems need persistent correctness conditions to prevent locally valid actions from producing an invalid overall state. | 有状态系统需要持续的正确性条件，避免局部有效行动产生无效总体状态。 |

## Model (model)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A purposeful simplification of reality used to explain, predict, discuss, or control some aspect of it. | 为解释、预测、讨论或控制现实某个方面而作出的有目的简化。 |
| scope | Design and decision-making that depend on an explicit representation of how something works. | 依赖明确工作机制表示的设计和决策。 |
| usage | Expose assumptions so predictions can be checked against actual outcomes. | 呈现假设，使预测可与实际结果比较。 |
| distinctions | This entry concerns representations of reality; an LLM is one specific learned computational model, not the entire meaning of Model. | 本条目关注现实的表示；大语言模型是一种特定学习型计算模型，未涵盖模型的全部含义。 |
| composition.pattern | Reality → Model → Decision → Observation | 现实 → 模型 → 决策 → 观察 |
| composition.example | An agent scheduler models tasks, dependencies, and worker capacity to estimate feasible ordering. | 智能体调度器对任务、依赖和工作者容量建模，以估计可行顺序。 |
| definitions.name | Model | 模型 |
| definitions.text | A purpose-driven simplification of some aspect of reality used to understand, predict, discuss, or control it. | 为理解、预测、讨论或控制现实某个方面，而进行的目标导向简化。 |
| considerations [0] | State what the model excludes and where it stops being useful. | 明确模型排除的内容及不再有用的边界。 |
| considerations [1] | A convincing explanation is not evidence that the model predicts well. | 令人信服的解释不能证明模型预测良好。 |
| ownership.rationale | LLMs can propose representations; structured implementations and observations test their operational usefulness. | 大语言模型可提出表示；结构化实现和观察检验其运行用途。 |
| priority.scope | Design and decision-making that depend on an explicit representation of how something works. | 依赖明确工作机制表示的设计和决策。 |
| priority.rationale | Models should be explicit wherever assumptions materially guide decisions, so their limits and predictive usefulness can be checked. | 假设会实质影响决策时，应明确模型，以便检查限制及预测用途。 |

## Module (module)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | An implementation unit that hides related decisions and capabilities behind an interface. | 将相关设计决策和能力隐藏在接口之后的实现单元。 |
| scope | Systems with responsibilities that can be separated without excessive cross-boundary coordination. | 能够划分责任，且无需过量跨边界协调的系统。 |
| usage | Hide decisions likely to change while keeping callers simple. | 隐藏可能变化的决策，同时让调用方保持简单。 |
| distinctions | A module is an implementation boundary; hierarchy describes nesting among units. | 模块是实现边界；层级描述单元之间的嵌套。 |
| composition.pattern | Module = Interface + Hidden Decisions | 模块 = 接口 + 隐藏决策 |
| composition.example | A retrieval module owns ranking and indexing choices behind a stable search interface. | 检索模块在稳定搜索接口之后负责排序与索引选择。 |
| definitions.name | Module | 模块 |
| definitions.text | A unit that encapsulates related capabilities and internal design decisions behind an interface. | 将相关能力和内部设计决策封装在接口之后的单元。 |
| considerations [0] | A forwarding wrapper may add navigation cost without hiding meaningful complexity. | 只转发的包装层可能增加导航成本，却未隐藏有意义的复杂性。 |
| considerations [1] | Evaluate module boundaries against actual change patterns. | 根据实际变更模式评估模块边界。 |
| ownership.rationale | Code boundaries and encapsulated implementations enforce the separation. | 代码边界和封装实现强制实施分离。 |
| priority.scope | Systems with responsibilities that can be separated without excessive cross-boundary coordination. | 能够划分责任，且无需过量跨边界协调的系统。 |
| priority.rationale | Explicit modules are a strong default when encapsulating change reduces the knowledge callers must carry. | 封装变化能够减少调用方所需知识时，通常应明确模块。 |

## Plan (plan)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | An inspectable statement of intended steps, dependencies, and stopping conditions for pursuing a goal. | 关于达成目标的预期步骤、依赖和停止条件的可检查表述。 |
| scope | Tasks requiring coordinated steps or revisions as new evidence appears. | 需要协调步骤，或需随新证据修订的任务。 |
| usage | Make the intended route reviewable without treating it as a guarantee of execution. | 使预期路径可审阅，同时避免将其视为执行保证。 |
| distinctions | Planning is the process of producing or revising a plan; a plan is its artifact. Actual execution may differ from it. | 规划是生成或修订计划的过程；计划是该过程的产物。实际执行可能与计划不同。 |
| composition.pattern | Goal → Reasoning → Plan → Execution | 目标 → 推理 → 计划 → 执行 |
| composition.example | A migration plan orders backup, transformation, verification, and cutover, with a stop condition on validation failure. | 迁移计划依次安排备份、转换、验证和切换，并规定验证失败时停止。 |
| definitions.name | Plan | 计划 |
| definitions.text | An inspectable representation of intended steps, dependencies, and stopping conditions for reaching a goal. | 为达成目标而规定预期步骤、依赖和停止条件的可检查表示。 |
| considerations [0] | Revise the plan when evidence invalidates assumptions. | 证据使假设失效时修订计划。 |
| considerations [1] | Use an established workflow when dynamic planning adds no value. | 动态规划无附加价值时，使用既定工作流。 |
| ownership.rationale | LLMs may propose steps; software records dependencies and enforces accepted execution boundaries. | 大语言模型可提出步骤；软件记录依赖，并执行已接受的运行边界。 |
| priority.scope | Tasks requiring coordinated steps or revisions as new evidence appears. | 需要协调步骤，或需随新证据修订的任务。 |
| priority.rationale | Multi-step tasks benefit from explicit plans when coordination or new evidence can change the route to completion. | 协调或新证据可能改变完成路径时，多步骤任务可从明确计划中受益。 |

## Purpose (purpose)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The intended benefit that explains why a system should exist and whom it should serve. | 说明系统为何应存在以及应服务于谁的预期益处。 |
| scope | Systems whose design requires tradeoffs among competing outcomes. | 设计需要在相互竞争的结果之间权衡的系统。 |
| usage | Align design choices around the intended benefit before selecting mechanisms. | 选择机制之前，围绕预期益处对齐设计选择。 |
| distinctions | Purpose explains why the system exists; a goal identifies a desired result within that purpose. | 目的说明系统为何存在；目标在该目的范围内明确期望结果。 |
| composition.pattern | Purpose → Success Criterion → Feedback | 目的 → 成功标准 → 反馈 |
| composition.example | A support assistant exists to resolve customer problems; its criteria include correct resolution rather than merely shorter replies. | 客服助手的目的是解决客户问题，其标准包括正确解决问题，不能仅关注更短回复。 |
| definitions.name | Purpose | 目的 |
| definitions.text | The reason a system exists, expressed through the change it should create and the people it should serve. | 通过系统应产生的变化和应服务的人来表达其存在理由。 |
| considerations [0] | Name affected people, including those who do not operate the system. | 明确受影响的人，包括不操作系统的人。 |
| considerations [1] | People responsible for the system must confirm value choices; model suggestions do not establish the purpose. | 系统负责人必须确认价值选择；模型建议无法确立目的。 |
| ownership.rationale | An LLM can surface alternatives and clarify intent; people confirm the purpose and software preserves the accepted statement. | 大语言模型可呈现替代方案和澄清意图；人确认目的，软件保留已接受表述。 |
| priority.scope | Systems whose design requires tradeoffs among competing outcomes. | 设计需要在相互竞争的结果之间权衡的系统。 |
| priority.rationale | Without an explicit purpose, locally successful design choices can pursue incompatible outcomes. | 缺少明确目的时，局部成功的设计选择可能追求相互冲突的结果。 |

## Recovery (recovery)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Mechanisms for restoring valid operation after failure, with reversibility describing how far effects can be undone. | 故障后恢复有效运行的机制；可逆性说明影响能够被撤销到何种程度。 |
| scope | Systems where failures, interruption, or partial effects require a route back to valid progress. | 失败、中断或部分影响需要返回有效进展路径的系统。 |
| usage | Design restart, compensation, and rollback paths before relying on repeated execution. | 依赖重复执行之前，设计重启、补偿和回滚路径。 |
| distinctions | Recovery restores valid operation or progress; reversibility is a property of actions. Recovery can succeed without exact reversal. | 恢复使运行或进度重新有效；可逆性是行动属性。恢复可以成功而无需完全逆转。 |
| composition.pattern | Failure → Detection → Rollback or Compensation → Resume | 失败 → 检测 → 回滚或补偿 → 恢复执行 |
| composition.example | After a partial document upload, a task records completed objects and resumes remaining work without duplicating them. | 文档部分上传后，任务记录已完成对象，再继续剩余工作而不重复上传。 |
| definitions.name | Reversibility | 可逆性 |
| definitions.text | The extent to which an action and its effects can be undone under specified conditions. | 在规定条件下，操作及其影响能够被撤销的程度。 |
| considerations [0] | Retrying a non-idempotent action can repeat side effects. | 重试非幂等操作可能重复副作用。 |
| considerations [1] | Compensation may restore business consistency without undoing every historical effect. | 补偿可以恢复业务一致性，无需撤销每个历史影响。 |
| ownership.rationale | Checkpoints, transactions, retry controls, and compensating operations implement known recovery paths. | 检查点、事务、重试控制和补偿操作实现已知恢复路径。 |
| priority.scope | Systems where failures, interruption, or partial effects require a route back to valid progress. | 失败、中断或部分影响需要返回有效进展路径的系统。 |
| priority.rationale | Recovery should be explicit when interruption or partial effects can leave work incomplete or make a repeated action unsafe. | 中断或部分影响可能使工作未完成，或让重复操作不安全时，应明确恢复机制。 |

## Relation (relation)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A meaningful, typed connection between identifiable objects, with direction where the meaning requires it. | 可识别对象之间有含义、有类型的连接，并在含义需要时明确方向。 |
| scope | Systems whose dependencies or associations affect behavior and interpretation. | 依赖或关联影响行为与解释的系统。 |
| usage | Make dependencies and provenance inspectable rather than implicit in prose. | 使依赖和来源可检查，避免只隐含在文字中。 |
| distinctions | A relation is a meaningful connection; a flow describes movement along or through connections. | 关系是有含义的连接；流描述沿连接或通过连接的移动。 |
| composition.pattern | Entity A → Typed Relation → Entity B | 实体 A → 带类型关系 → 实体 B |
| composition.example | A generated claim links to the source passage that supports it and the report that contains it. | 生成的主张连接到支持它的来源片段及包含它的报告。 |
| definitions.name | Relation | 关系 |
| definitions.text | A connection between identifiable objects with explicit meaning, type, and, where appropriate, direction. | 可识别对象之间含义、类型明确，并在适用时具有方向的连接。 |
| considerations [0] | State whether the relation is directional and what deletion means. | 说明关系是否有方向，以及删除意味着什么。 |
| considerations [1] | A link alone does not prove the semantic relationship it claims. | 链接本身无法证明所声称的语义关系。 |
| ownership.rationale | Structured references and integrity checks maintain links; semantic claims may still need review. | 结构化引用和完整性检查维持链接；语义主张仍可能需要审阅。 |
| priority.scope | Systems whose dependencies or associations affect behavior and interpretation. | 依赖或关联影响行为与解释的系统。 |
| priority.rationale | Dependencies and associations shape system behavior, so leaving their meaning implicit undermines correctness and traceability. | 依赖和关联塑造系统行为，含义不明确会削弱正确性和可追溯性。 |

## Resource (resource)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A finite capacity or asset that actions consume, reserve, share, or compete to obtain. | 行动会消耗、预留、共享或争夺的有限容量或资产。 |
| scope | Systems with finite time, money, compute, storage, or attention capacity. | 时间、资金、计算、存储或注意力容量有限的系统。 |
| usage | Allocate scarce capacity explicitly and define what happens when it runs out. | 明确分配稀缺容量，并规定耗尽后的处理方式。 |
| distinctions | Resource is the available capacity; a budget constrains consumption and context is information occupying some of that capacity. | 资源是可用容量；预算限制消耗；上下文是占用部分容量的信息。 |
| composition.pattern | Actor + Resource Budget → Bounded Execution | 主体 + 资源预算 → 受限执行 |
| composition.example | A research agent receives a token allowance, API spending cap, and deadline. | 研究智能体获得令牌额度、API 支出上限和截止时间。 |
| definitions.name | Resource | 资源 |
| definitions.text | A limited capacity or asset that can be consumed, allocated, reserved, or contested. | 能够被消耗、分配、预留或争夺的有限容量或资产。 |
| considerations [0] | A budget should be checked against actual usage, not model estimates alone. | 应根据实际用量检查预算，不能仅用模型估计。 |
| considerations [1] | Reserve headroom for recovery and final verification. | 为恢复和最终验证预留余量。 |
| ownership.rationale | Counters, quotas, schedulers, and billing records govern allocation and consumption. | 计数器、配额、调度器和计费记录管理分配与消耗。 |
| priority.scope | Systems with finite time, money, compute, storage, or attention capacity. | 时间、资金、计算、存储或注意力容量有限的系统。 |
| priority.rationale | Every operational design faces finite capacity, and unchecked consumption can prevent both task completion and recovery. | 每种运行设计都面临有限容量，未经检查的消耗可能阻止任务完成和故障恢复。 |

## Rule / Policy (rule-policy)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Specific conditional prescriptions and broader governing decisions that shape permissible or required behavior. | 规定允许或必须行为的具体条件规则及更广泛管理决策。 |
| scope | Systems that need consistent decisions about admissible or required behavior. | 需要对允许或必需行为作出一致决策的系统。 |
| usage | Make repeatable decisions enforceable and exceptions visible. | 使可重复决策能够执行约束，并让例外可见。 |
| distinctions | Instructions may mix goals and data; rules and policies specifically govern behavior. | 指令可能混合目标与数据；规则和策略则专门管理行为。 |
| composition.pattern | Condition → Policy → Allowed Action | 条件 → 策略 → 允许操作 |
| composition.example | A publication policy requires approval before a report becomes public; a rule checks the approval record at submission. | 发布策略要求报告公开前获得批准；提交时的规则检查批准记录。 |
| definitions.name [0] | Rule | 规则 |
| definitions.name [1] | Policy | 策略 |
| definitions.text [0] | An explicit condition and prescribed consequence governing a particular case. | 规定具体情况的明确条件及应产生的后果。 |
| definitions.text [1] | A set of governing decisions or principles that determines what behavior is permitted, required, or preferred across cases. | 跨情况决定哪些行为允许、必须或优先的管理决策或原则集合。 |
| considerations [0] | Keep hard prohibitions separate from preferences. | 将硬性禁止与偏好分开。 |
| considerations [1] | A model-generated policy explanation does not replace the enforcing rule. | 模型生成的策略解释不能替代执行约束规则。 |
| ownership.rationale | Formalizable decisions belong in code or policy engines, with explicit handling for cases needing human judgment. | 可形式化决策应由代码或策略引擎负责，并明确处理需要人工判断的情况。 |
| priority.scope | Systems that need consistent decisions about admissible or required behavior. | 需要对允许或必需行为作出一致决策的系统。 |
| priority.rationale | Repeatable behavior requires explicit governing decisions so that equivalent cases do not depend on incidental model interpretation. | 可重复行为需要明确管理决策，使等效情况不依赖偶然的模型解释。 |

## Stakeholder (stakeholder)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A person or group with influence over, exposure to, or an interest in a system and its consequences. | 对系统及其后果具有影响、受到影响或有利益关系的个人或群体。 |
| scope | Socio-technical systems with multiple interests or external effects. | 具有多方利益或外部影响的社会技术系统。 |
| usage | Expose whose needs, authority, and risks must enter design decisions. | 明确设计决策必须考虑谁的需求、权限和风险。 |
| distinctions | A stakeholder has an interest or exposure; an actor performs actions. One party can occupy both roles. | 利益相关方具有利益或受到影响；行动主体实施操作。同一方可以同时具有两种角色。 |
| composition.pattern | Stakeholder + Purpose + Boundary → Policy | 利益相关方 + 目的 + 边界 → 策略 |
| composition.example | A hiring assistant accounts for candidates, recruiters, reviewers, and people affected by inaccurate recommendations. | 招聘助手考虑候选人、招聘人员、审阅者，以及受不准确推荐影响的人。 |
| definitions.name | Stakeholder | 利益相关方 |
| definitions.text | A person or group that influences a system, is affected by it, or bears consequences of its operation. | 影响系统、受到系统影响或承担系统运行后果的个人或群体。 |
| considerations [0] | Direct users are not the only affected parties. | 受影响方不限于直接用户。 |
| considerations [1] | Do not infer consent or authority from a generated stakeholder list. | 不能从生成的利益相关方清单推断同意或权限。 |
| ownership.rationale | LLMs can help discover perspectives; people validate representation and software records explicit responsibilities. | 大语言模型可帮助发现不同视角；人确认代表性，软件记录明确责任。 |
| priority.scope | Socio-technical systems with multiple interests or external effects. | 具有多方利益或外部影响的社会技术系统。 |
| priority.rationale | Explicit stakeholder modeling is a strong default when benefits, risks, and decision authority are distributed across people. | 益处、风险和决策权限分布在不同人之间时，通常应明确建模利益相关方。 |

## State (state)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The current facts and progress that a system needs to determine what can happen next. | 系统决定下一步能够发生什么所需的当前事实与进度。 |
| scope | Stateful software and agent workflows where future behavior depends on current facts. | 未来行为依赖当前事实的有状态软件和智能体工作流。 |
| usage | Keep progress and commitments explicit so work can resume without reconstructing them from prose. | 明确进度和承诺，使工作可恢复，无需从文字中重建。 |
| distinctions | State represents current facts; memory retains information for later use and context is what is currently available to reasoning. | 状态表示当前事实；记忆保留信息供未来使用；上下文是当前推理可用的信息。 |
| composition.pattern | State + Event → Next State | 状态 + 事件 → 下一状态 |
| composition.example | An agent task records its current phase, accepted artifact version, and pending approval. | 智能体任务记录当前阶段、已接受产物版本和待处理批准。 |
| considerations [0] | Separate authoritative state from generated summaries. | 将权威状态与生成摘要分开。 |
| considerations [1] | Handle concurrent updates before treating a snapshot as current. | 将快照视为当前状态之前，处理并发更新。 |
| ownership.rationale | Databases, files, and state machines store and update authoritative state under explicit consistency rules. | 数据库、文件和状态机按照明确一致性规则存储与更新权威状态。 |
| priority.scope | Stateful software and agent workflows where future behavior depends on current facts. | 未来行为依赖当前事实的有状态软件和智能体工作流。 |
| priority.rationale | Future behavior depends on current facts, making explicit authoritative state essential to correct transitions and reliable resumption. | 未来行为依赖当前事实，因此明确的权威状态对正确转换和可靠恢复至关重要。 |

## Success Criterion (success-criterion)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | An observable condition used to decide whether an intended result has been achieved. | 用于判断预期结果是否达成的可观察条件。 |
| scope | Systems and tasks that need a defensible completion or acceptance decision. | 需要有依据的完成或验收决策的系统和任务。 |
| usage | Turn intended outcomes into evidence requirements before work starts. | 工作开始之前，将预期结果转化为证据要求。 |
| distinctions | The goal is the desired result; the criterion states how attainment will be judged. | 目标是期望结果；标准说明如何判断目标达成。 |
| composition.pattern | Goal → Success Criterion → Evidence → Verdict | 目标 → 成功标准 → 证据 → 判定 |
| composition.example | A code agent finishes only after the requested behavior works and the agreed regression checks pass. | 编码智能体只有在所需行为正常且约定回归检查通过后，才算完成。 |
| definitions.name | Success Criterion | 成功标准 |
| definitions.text | An observable condition used to decide whether an intended result has been achieved. | 用于判断预期结果是否达成的可观察条件。 |
| considerations [0] | Proxy metrics can improve while the intended outcome worsens. | 代理指标可能改善，而预期结果恶化。 |
| considerations [1] | Specify who resolves ambiguous or subjective acceptance. | 明确谁负责解决含糊或主观验收问题。 |
| ownership.rationale | People confirm acceptance expectations; software checks objective conditions and LLMs can assist bounded semantic assessment. | 人确认验收预期；软件检查客观条件；大语言模型可协助范围受限的语义评估。 |
| priority.scope | Systems and tasks that need a defensible completion or acceptance decision. | 需要有依据的完成或验收决策的系统和任务。 |
| priority.rationale | Completion claims need explicit criteria so that activity, confidence, and proxy metrics do not substitute for the intended result. | 完成主张需要明确标准，以避免活动、自信和代理指标替代预期结果。 |

## Variety / Uncertainty (variety-uncertainty)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The range of relevant situations and the limits of knowledge about which situation holds or what will happen. | 相关情况的范围，以及对当前是哪种情况或将发生什么的知识限制。 |
| scope | Systems facing heterogeneous conditions or incomplete information. | 面对异质条件或不完整信息的系统。 |
| usage | Match response options and evidence collection to the situations the system must handle. | 让响应选项和证据收集匹配系统必须处理的情况。 |
| distinctions | Many possible states can be well understood; a narrow situation can still be poorly known. Variety and uncertainty are not interchangeable quantities. | 多种可能状态可以被充分理解；狭窄情况也可能缺少了解。多样性与不确定性无法互换。 |
| composition.pattern | Environmental Variety → Response Options; Uncertainty → Observation | 环境多样性 → 响应选项；不确定性 → 观察 |
| composition.example | A support agent uses fixed routing for known request types and gathers more evidence for unfamiliar failures. | 客服智能体对已知请求类型采用固定路由，对不熟悉故障则收集更多证据。 |
| definitions.name [0] | Variety | 多样性 |
| definitions.name [1] | Uncertainty | 不确定性 |
| definitions.text [0] | The range of distinguishable states or situations relevant to a system and its possible responses. | 与系统及其可能响应有关的可区分状态或情况的范围。 |
| definitions.text [1] | Limited knowledge about which state holds, what will happen, or how well an explanation applies. | 对当前状态、未来结果或解释适用程度的有限了解。 |
| considerations [0] | More autonomy is not automatically a better response to uncertainty. | 更高自主性不一定更适合应对不确定性。 |
| considerations [1] | State uncertainty about facts separately from variability in the environment. | 将事实不确定性与环境变化分开表述。 |
| ownership.rationale | Software tracks observable conditions and available responses; LLMs assist interpretation where cases cannot be fully enumerated. | 软件跟踪可观察条件和可用响应；在无法完全枚举情况时，大语言模型协助解释。 |
| priority.scope | Systems facing heterogeneous conditions or incomplete information. | 面对异质条件或不完整信息的系统。 |
| priority.rationale | Heterogeneous or incompletely known conditions require explicit response options and evidence needs to avoid unjustified uniform behavior. | 异质或了解不完整的条件需要明确响应选项和证据需求，以避免无依据地统一处理。 |

## View / Projection (view-projection)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A purpose-specific representation and the transformation that derives it from underlying records or models. | 针对特定目的的信息表示，以及从底层记录或模型派生该表示的转换。 |
| scope | Systems serving multiple audiences or surfaces from shared records. | 通过共享记录服务多个受众或界面的系统。 |
| usage | Present the information each reader needs without creating competing sources of truth. | 呈现每个读者所需的信息，避免创建相互竞争的事实来源。 |
| distinctions | A view is the representation a consumer uses; projection is the derivation, though software sometimes names its output a projection too. | 视图是使用方采用的表示；投影是派生过程，但软件有时也把其输出称为投影。 |
| composition.pattern | Model + Stakeholder + Purpose → Projection → View | 模型 + 利益相关方 + 目的 → 投影 → 视图 |
| composition.example | A concept record feeds a detail page, search result, and primitive association list. | 概念记录生成详情页、搜索结果和原语关联清单。 |
| definitions.name [0] | View | 视图 |
| definitions.name [1] | Projection | 投影 |
| definitions.text [0] | A purpose-specific presentation of information from an underlying model or record set. | 针对特定目的呈现底层模型或记录集信息的表示。 |
| definitions.text [1] | A transformation that derives a selected representation from underlying information. | 从底层信息派生选定表示的转换。 |
| considerations [0] | A projection can omit important context or become stale. | 投影可能遗漏重要上下文或变得过时。 |
| considerations [1] | Edit canonical records rather than independently editing derived copies. | 编辑 canonical 记录，避免独立编辑派生副本。 |
| ownership.rationale | Templates and queries derive repeatable representations from canonical data. | 模板与查询从 canonical 数据派生可重复表示。 |
| priority.scope | Systems serving multiple audiences or surfaces from shared records. | 通过共享记录服务多个受众或界面的系统。 |
| priority.rationale | Explicit projections are a strong default when several surfaces must remain consistent with one authoritative representation. | 多个界面必须与同一权威表示保持一致时，通常应明确投影。 |
