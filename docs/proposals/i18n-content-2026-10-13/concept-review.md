# Concept Chinese draft review

Canonical text is the translation source. Official references guide terminology only. All new units remain draft; existing reviewed units retain their prior approval.

## Context Budget (context-budget)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | The finite allocation of attention, tokens, latency, and retrieval capacity available to an AI system for a particular decision. | AI 系统为某次决策可分配的有限注意力、令牌、延迟和检索容量。 | draft |
| definition | A context budget is the practical limit on how much information a model can use effectively, not merely the advertised context-window size. It accounts for token volume, placement, relevance, competing instructions, latency, and the model's ability to recover important facts. | 上下文预算是模型能够有效使用的信息量的实际限制，范围不限于标称上下文窗口大小。它考虑令牌数量、信息位置、相关性、相互竞争的指令、延迟，以及模型找回重要事实的能力。 | draft |
| why_it_matters | Every additional item competes for attention and cost. Explicit budgeting forces teams to rank evidence, compress history, and keep critical constraints visible. | 每条新增信息都会占用注意力并增加成本。明确预算会促使团队对证据排序、压缩历史，并让关键约束保持可见。 | draft |
| when_to_use | Use it when designing long sessions, multi-document retrieval, agent handoffs, or systems with strict latency and cost targets. | 设计长会话、多文档检索、智能体交接，或具有严格延迟和成本目标的系统时使用。 | draft |
| anti_pattern | Filling the available window because unused tokens appear to be free capacity. | 因为未使用的令牌看似是空闲容量，就把可用窗口填满。 | draft |

## Context Compression (context-compression)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Keep the important parts and make the story shorter. | 保留重要内容，缩短信息表述。 | draft |
| definition | Context compression rewrites or encodes working information into a smaller representation. A useful compressed account preserves constraints, decisions, unresolved questions, and references; it cannot be assumed to preserve every detail. | 上下文压缩将工作信息改写或编码为更小的表示。有用的压缩记录会保留约束、决策、未解决问题和引用，但不能假定它保留了每个细节。 | draft |
| why_it_matters | Long tasks need room for new observations without losing the facts that determine what the agent should do next. | 长任务需要为新观察留出空间，同时保留决定智能体下一步行动的事实。 | draft |
| when_to_use | Use it to summarize completed investigation steps while retaining exact identifiers and pending work. | 总结已完成的调查步骤，同时保留准确标识和待办工作时使用。 | draft |
| anti_pattern | Replacing precise requirements with a vague summary that cannot support the next action. | 用无法支持下一步行动的含糊摘要替代精确要求。 | draft |

## Context Handoff (context-handoff)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Pass the right working context to another agent. | 把适当的工作上下文交给另一个智能体。 | draft |
| definition | A context handoff transfers the information needed to continue work, including facts, constraints, progress, and open questions. It may accompany a responsibility handoff, but sharing context alone does not change ownership. | 上下文交接传递继续工作所需的信息，包括事实、约束、进度和未解决问题。它可以与责任交接同时发生，但仅共享上下文不会改变责任归属。 | draft |
| why_it_matters | A receiver can continue efficiently only when the packet explains what is known, what remains uncertain, and where supporting artifacts live. | 交接包说明已知事实、剩余不确定性和支撑材料的位置，接收方才能高效继续工作。 | draft |
| when_to_use | Use it when an investigator sends findings to an implementer or a session reaches its context limit. | 调查智能体向实现智能体传递发现，或会话达到上下文限制时使用。 | draft |
| anti_pattern | Sending an unfiltered transcript without a current objective, evidence pointers, or next step. | 发送未经筛选的完整记录，却未说明当前目标、证据位置和下一步。 | draft |

## Context Isolation (context-isolation)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Keep unrelated tasks from mixing their information. | 避免无关任务混用信息。 | draft |
| definition | Context isolation separates the working information of tasks or roles so that irrelevant assumptions do not leak between them. Separate conversations can support isolation, but do not by themselves isolate files, credentials, or permissions. | 上下文隔离将不同任务或角色的工作信息分开，减少无关假设相互泄漏。独立对话有助于隔离，但对话独立本身不会隔离文件、凭据或权限。 | draft |
| why_it_matters | Task separation reduces accidental reuse of another task's instructions, private details, or unverified conclusions. | 任务隔离可减少误用其他任务的指令、私密信息或未经验证结论。 | draft |
| when_to_use | Use it when separate agents analyze different customers or independent workstreams. | 不同智能体分析不同客户或独立工作流时使用。 | draft |
| anti_pattern | Assuming separate chat histories prevent agents from reading the same unrestricted storage. | 假定聊天历史分开，就能阻止智能体读取同一个未受限制的存储。 | draft |

## Context Selection (context-selection)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Choose what deserves attention in the current step. | 选择当前步骤值得关注的信息。 | draft |
| definition | Context selection chooses which available information to include for a specific decision. It weighs relevance, reliability, and cost; it does not require rewriting or deleting the underlying source records. | 上下文选择决定针对某次决策应纳入哪些可用信息。它权衡相关性、可靠性和成本，无需改写或删除底层来源记录。 | draft |
| why_it_matters | Selective inputs reduce distraction and leave room for the evidence most likely to change the next decision. | 有选择地提供输入可减少干扰，并为可能改变下一步决策的证据留出空间。 | draft |
| when_to_use | Use it to load the relevant function and test failure instead of an entire code repository. | 只加载相关函数和测试失败信息，而非整个代码仓库时使用。 | draft |
| anti_pattern | Including every retrieved document merely because there is still space in the window. | 仅因窗口还有空间，就纳入每份检索到的文档。 | draft |

## Context Window (context-window)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Limit how much the agent can see at once. | 限定智能体一次能够看到的信息量。 | draft |
| definition | A context window is the model's bounded token capacity for an inference. Input and generated output must fit the interface's accounting rules; capacity is distinct from reliable recall or attention to every included fact. | 上下文窗口是模型一次推理能够容纳的有限令牌容量。输入和生成的输出须符合接口的计数规则；容量大小与可靠回忆或关注所有已纳入事实的能力是不同属性。 | draft |
| why_it_matters | Window limits constrain how much history, retrieved text, and output can fit into one interaction, making selection necessary. | 窗口限制决定一次交互能容纳多少历史、检索文本和输出，因此必须选择信息。 | draft |
| when_to_use | Use it when sizing long document analysis and reserving room for the model's response. | 估算长文档分析规模并为模型响应预留空间时使用。 | draft |
| anti_pattern | Filling the available input capacity and assuming all details will be used equally well. | 填满可用输入容量，并假定模型会同样有效地使用所有细节。 | draft |

## Context (context)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Give the agent what it needs to know now. | 提供智能体当前需要知道的信息。 | draft |
| definition | Context is the information available to a model for a particular inference, including instructions, conversation, selected records, and tool results. Information stored elsewhere becomes context only when supplied to that inference. | 上下文是模型在某次推理中可用的信息，包括指令、对话、选定记录和工具结果。存储在其他位置的信息，只有被提供给这次推理后才成为上下文。 | draft |
| why_it_matters | Correct decisions require relevant facts to be available at the time of use, even when those facts already exist somewhere in the system. | 正确决策要求相关事实在使用时可用，即使这些事实已经存在于系统中的其他位置。 | draft |
| when_to_use | Use it when assembling the request, current file contents, and constraints for a coding step. | 为编码步骤组织请求、当前文件内容和约束时使用。 | draft |
| anti_pattern | Assuming an agent knows a fact merely because it exists in a repository or earlier session. | 仅因某个事实存在于仓库或以前的会话中，就假定智能体知道它。 | draft |

## Evaluation (evaluation)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Measure how well the agent performs on defined tasks. | 衡量智能体在明确任务上的表现。 | draft |
| definition | Evaluation assesses quality or performance using selected cases, criteria, and a measurement procedure. It can compare systems or track regressions; an aggregate score does not verify every outcome in a particular live task. | 评估使用选定案例、标准和测量过程判断质量或性能。它可以比较系统或跟踪回归；汇总分数无法验证某个实际任务中的每个结果。 | draft |
| why_it_matters | Repeatable assessments reveal tradeoffs and regressions that isolated demonstrations or confident explanations can hide. | 可重复的评估能揭示单次演示或自信解释可能掩盖的权衡和回归。 | draft |
| when_to_use | Use it to compare two agent configurations on representative tasks with the same scoring criteria. | 使用相同评分标准，在代表性任务上比较两种智能体配置时使用。 | draft |
| anti_pattern | Optimizing for a small benchmark while claiming the score proves reliability on all user requests. | 针对小型基准优化，却声称分数证明了所有用户请求上的可靠性。 | draft |

## Guardrail (guardrail)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Stop the agent from taking disallowed actions. | 阻止智能体执行不允许的操作。 | draft |
| definition | A guardrail is a control that constrains or checks behavior at a defined boundary, such as validating inputs or blocking a tool operation. Advisory model instructions can help, but do not provide the same enforcement as runtime controls. | 护栏是在明确边界上约束或检查行为的控制措施，例如验证输入或阻止工具操作。向模型提供建议性指令会有帮助，但其执行约束不同于运行时控制。 | draft |
| why_it_matters | Explicit controls reduce dependence on the model consistently interpreting and following every safety or business rule. | 明确的控制措施可减少对模型持续正确理解并遵守全部安全或业务规则的依赖。 | draft |
| when_to_use | Use it to reject tool arguments outside a permitted resource scope before execution. | 执行工具前，拒绝超出允许资源范围的参数时使用。 | draft |
| anti_pattern | Relying only on a sentence asking the model not to access restricted files. | 仅依赖一句要求模型不要访问受限文件的指令。 | draft |

## Handoff (handoff)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | A controlled transfer of responsibility, relevant state, and completion criteria from one actor or agent to another. | 将责任、相关状态和完成标准从一个行动主体或智能体受控地交给另一个。 | draft |
| definition | A handoff is more than sending a transcript. It packages the objective, current state, load-bearing facts, authority limits, artifacts, unresolved risks, and the condition under which responsibility returns or completes. | 交接的内容超出对话记录，需包含目标、当前状态、决定性事实、权限限制、产物、未解决风险，以及责任返回或完成的条件。 | draft |
| why_it_matters | Work commonly fails at ownership boundaries. A structured handoff preserves intent and makes it clear which actor is accountable for the next state transition. | 工作常在责任归属边界处失败。结构化交接保留意图，并明确哪个主体负责下一次状态转换。 | draft |
| when_to_use | Use it between agents, between an agent and a human, or when resuming work in a new execution context. | 在智能体之间、智能体与人之间交接，或在新执行上下文中恢复工作时使用。 | draft |
| anti_pattern | Forwarding raw history and assuming the receiver will infer priorities, permissions, and done criteria. | 转发原始历史，并假定接收方会自行推断优先级、权限和完成标准。 | draft |

## Instructions (instructions)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Tell the agent the rules to follow during its work. | 说明智能体工作时应遵循的规则。 | draft |
| definition | Instructions specify how an agent should behave, including constraints, priorities, and output requirements. They can apply across tasks or to one request; descriptive source material is not automatically an instruction. | 指令规定智能体应如何行动，包括约束、优先级和输出要求。它可以跨任务生效，也可以仅针对一个请求；描述性来源材料不会自动成为指令。 | draft |
| why_it_matters | Explicit rules make expectations reusable and help distinguish authorized behavior from text encountered in retrieved material. | 明确规则使要求可复用，也帮助区分已授权行为与检索材料中的文字。 | draft |
| when_to_use | Use them to require citations, define editing scope, or establish a team's review requirements. | 要求提供引用、限定编辑范围或制定团队审查要求时使用。 | draft |
| anti_pattern | Treating commands found inside an untrusted document as authorized operating rules. | 把不可信文档中的命令当作已授权的操作规则。 | draft |

## Long-Term Memory (long-term-memory)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Keep useful knowledge available for future tasks. | 让有用知识可供未来任务使用。 | draft |
| definition | Long-term memory persists selected information beyond the current task or session and makes it retrievable later. Stored notes are not automatically loaded into context, and persistence alone does not establish their accuracy. | 长期记忆将选定信息保留到当前任务或会话结束之后，供以后检索。已保存笔记不会自动载入上下文，持久保存本身也不能证明内容准确。 | draft |
| why_it_matters | Reusable knowledge can reduce repeated work, provided the system checks relevance, freshness, and the user's retention expectations. | 可复用知识能减少重复工作，前提是系统检查相关性、时效性，并遵守用户对保留信息的预期。 | draft |
| when_to_use | Use it to retain a confirmed project convention that will matter in later sessions. | 保存已确认且后续会话还会用到的项目约定时使用。 | draft |
| anti_pattern | Saving every interaction indefinitely and treating old notes as current instructions. | 无限期保存每次交互，并把旧笔记当作当前指令。 | draft |

## MCP (mcp)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Give tools a common way to connect to agents. | 为工具与智能体的连接提供通用方式。 | draft |
| definition | The Model Context Protocol is an open protocol for connecting AI applications to external capabilities and information. Servers can expose tools, resources, and prompts; the host application remains responsible for access decisions and execution policy. | 模型上下文协议（MCP）是一种开放协议，用于将 AI 应用连接到外部能力和信息。服务器可以提供工具、资源和提示；宿主应用仍负责访问决策和执行策略。 | draft |
| why_it_matters | A shared integration interface reduces custom connectors while keeping protocol compatibility separate from trust in any particular server. | 共享集成接口可减少定制连接器，同时将协议兼容性与对具体服务器的信任分开判断。 | draft |
| when_to_use | Use it when exposing a service to multiple compatible AI applications through a common interface. | 通过通用接口向多个兼容 AI 应用提供服务时使用。 | draft |
| anti_pattern | Assuming that a compatible MCP server is automatically trustworthy or authorized to access all data. | 假定兼容的 MCP 服务器自动值得信任，或已获准访问全部数据。 | draft |

## Memory Architecture (memory-architecture)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | The design of how an AI system records, selects, updates, expires, and retrieves information across different time horizons. | 设计 AI 系统如何在不同时间跨度内记录、选择、更新、使信息过期和检索信息。 | draft |
| definition | Memory architecture separates transient working state, episodic records, durable user or domain knowledge, and authoritative external sources. It defines write criteria, retrieval policy, provenance, correction, and expiration for each memory class. | 记忆架构区分临时工作状态、事件记录、持久用户或领域知识，以及权威外部来源。它为每类记忆定义写入标准、检索策略、来源追溯、纠正和过期规则。 | draft |
| why_it_matters | Persistence without structure accumulates stale or sensitive data, while no persistence forces repeated discovery. Architecture makes remembering selective and accountable. | 缺少结构的持久存储会累积过时或敏感数据，完全不保存又会导致重复调查。记忆架构让保留信息具有选择性且可追责。 | draft |
| when_to_use | Use it for assistants, recurring workflows, personalization, organizational agents, or any session that outlives one context window. | 用于助手、重复工作流、个性化、组织智能体，或持续时间超过一个上下文窗口的会话。 | draft |
| anti_pattern | Storing every conversation fragment in one vector index and calling the result long-term memory. | 把所有对话片段放入一个向量索引，并将其称为长期记忆。 | draft |

## Memory Consolidation (memory-consolidation)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Turn many experiences into a useful reusable lesson. | 从多次经验中形成可复用的有效经验总结。 | draft |
| definition | Memory consolidation reviews multiple observations or episodes and produces a more compact durable record. It should distinguish repeated evidence from tentative interpretation and preserve references needed to revisit the lesson. | 记忆整合审阅多个观察或事件，并形成更精简的持久记录。它应区分重复出现的证据与暂定解释，并保留重新检查总结所需的引用。 | draft |
| why_it_matters | Organizing experience into scoped lessons makes retrieval more useful than accumulating duplicate notes and contradictory fragments. | 将经验整理成适用范围明确的总结，比累积重复笔记和相互矛盾的片段更有利于检索。 | draft |
| when_to_use | Use it after several incidents reveal the same verified failure mechanism and remedy. | 多个事件揭示相同且已验证的故障机制和补救措施后使用。 | draft |
| anti_pattern | Promoting a single speculative explanation into a permanent rule for every future task. | 把一次推测性解释提升为适用于所有后续任务的永久规则。 | draft |

## Progressive Disclosure (progressive-disclosure)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Revealing instructions, evidence, and tools only when the current stage of work makes them relevant and actionable. | 仅在当前工作阶段需要且能够使用时，提供指令、证据和工具。 | draft |
| definition | Progressive disclosure sequences context instead of loading everything at startup. A system begins with orientation and decision rules, then retrieves detailed procedures, examples, or tool schemas at the point where they can influence the next action. | 渐进式披露按阶段组织上下文，避免启动时加载全部内容。系统先提供方向和决策规则，再在能影响下一步行动时检索详细过程、示例或工具 schema。 | draft |
| why_it_matters | Staged context reduces distraction and token pressure while preserving access to depth. It also makes the provenance of a decision easier to inspect. | 分阶段提供上下文能减少干扰和令牌压力，同时保留获取深入内容的途径，也让决策来源更容易检查。 | draft |
| when_to_use | Use it for large instruction sets, specialized tools, branched workflows, or knowledge bases with uneven relevance. | 用于大量指令、专用工具、分支工作流，或相关性差异较大的知识库。 | draft |
| anti_pattern | Hiding critical safety constraints until after the agent has already committed to an action. | 直到智能体已经决定执行操作后，才披露关键安全约束。 | draft |

## RAG (rag)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Find useful knowledge and bring it into context. | 检索有用知识并将其纳入上下文。 | draft |
| definition | Retrieval-augmented generation combines retrieval of external information with generation conditioned on that information. Retrieval supplies candidate evidence; the generated answer still needs checks for relevance, support, and freshness. | 检索增强生成（RAG）结合外部信息检索与基于这些信息的生成。检索提供候选证据；生成的答案仍需检查相关性、证据支撑和时效性。 | draft |
| why_it_matters | RAG lets an application use an updateable knowledge source without relying solely on facts encoded in model parameters. | RAG 让应用能够使用可更新的知识来源，减少对模型参数中编码事实的单独依赖。 | draft |
| when_to_use | Use it when answering questions against a maintained document collection with source references. | 基于持续维护的文档集合回答问题，并提供来源引用时使用。 | draft |
| anti_pattern | Assuming that attaching retrieved passages guarantees a factual or properly cited answer. | 假定附上检索片段就能保证答案符合事实且引用正确。 | draft |

## Retrieval (retrieval)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Look up information when the task needs it. | 在任务需要时查找信息。 | draft |
| definition | Retrieval locates information in an external store using a query, filters, or direct identifiers. It may use lexical search, semantic search, or database lookup; returning a result does not establish that the result is correct. | 检索使用查询、筛选条件或直接标识符，从外部存储中定位信息。它可以采用词法搜索、语义搜索或数据库查询；返回结果并不能证明结果正确。 | draft |
| why_it_matters | Looking up task-specific facts expands what an agent can use beyond its current context and the model's learned knowledge. | 查找任务相关事实能扩展智能体可用的信息，使其超出当前上下文和模型已学知识。 | draft |
| when_to_use | Use it to find the relevant policy section before answering a policy question. | 回答政策问题前查找相关政策章节时使用。 | draft |
| anti_pattern | Treating the highest-ranked search hit as authoritative without checking its contents. | 未检查内容，就把排名最高的搜索结果当作权威来源。 | draft |

## Skill (skill)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Teach the agent how to do a kind of job well. | 向智能体提供完成某类工作的可复用方法。 | draft |
| definition | A skill packages reusable procedural guidance for a class of tasks. It may include examples, references, or scripts; in the Agent Skills format, a SKILL.md file supplies instructions and metadata. A skill need not be an executable tool. | 技能将某类任务的可复用操作指导打包。它可以包含示例、参考资料或脚本；在 Agent Skills 格式中，SKILL.md 文件提供指令和元数据。技能无需是可执行工具。 | draft |
| why_it_matters | Task-specific procedures make useful expertise reusable without placing every instruction in every model request. | 任务专用过程使有效经验可复用，无需在每个模型请求中都放入全部指令。 | draft |
| when_to_use | Use it to package a repeatable document review procedure with templates and reference material. | 将可重复的文档审查过程、模板和参考资料打包时使用。 | draft |
| anti_pattern | Loading all available skills into every request regardless of task relevance. | 无论任务是否相关，都在每个请求中加载全部可用技能。 | draft |

## System Prompt (system-prompt)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Define the agent's basic behavior and operating rules. | 定义智能体的基本行为和操作规则。 | draft |
| definition | A system prompt is a message supplied through a model interface's system role to guide general behavior. Its precedence depends on the interface; text in this role does not itself enforce access permissions. | 系统提示是通过模型接口的 system 角色提供的消息，用于指导通用行为。其优先级取决于接口；处于该角色的文本本身不会强制执行访问权限。 | draft |
| why_it_matters | Separating baseline behavior from task requests makes the agent's role easier to maintain while keeping enforcement responsibilities visible. | 将基础行为与任务请求分开，可降低维护智能体角色的难度，同时保持执行约束的责任明确。 | draft |
| when_to_use | Use it to define a support agent's scope, response style, and handling of unsupported requests. | 定义客服智能体的职责范围、响应风格和不支持请求的处理方式时使用。 | draft |
| anti_pattern | Putting secrets or access controls in a system prompt and assuming they are technically protected. | 将秘密或访问控制放入系统提示，并假定它们已受到技术保护。 | draft |

## Tool Calling (tool-calling)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Let the agent invoke an external capability. | 让智能体请求使用外部能力。 | draft |
| definition | Tool calling is the interaction in which a model requests a named operation with structured arguments and the host executes or rejects it. Returned results become observations; a request alone does not prove successful execution. | 工具调用是模型以结构化参数请求某个命名操作，并由宿主执行或拒绝的交互过程。返回的结果成为观察信息；仅发出请求不能证明执行成功。 | draft |
| why_it_matters | Separating the request from execution makes argument validation, permission checks, and error reporting visible. | 将请求与执行分开，使参数验证、权限检查和错误报告可见。 | draft |
| when_to_use | Use it when an agent needs to query a database and use the returned rows in its next decision. | 智能体需要查询数据库，并在下一次决策中使用返回记录时使用。 | draft |
| anti_pattern | Reporting success from the generated call arguments before receiving and checking the tool result. | 尚未收到并检查工具结果，就根据生成的调用参数报告成功。 | draft |

## Tool Selection (tool-selection)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Choose the best tool for the next concrete step. | 为下一项具体步骤选择最合适的工具。 | draft |
| definition | Tool selection matches the current information need or action to an available capability. The choice considers scope, permissions, expected output, and side effects; selecting a tool is distinct from invoking it. | 工具选择将当前信息需求或操作与可用能力匹配。选择时考虑范围、权限、预期输出和副作用；选定工具与调用工具是两个步骤。 | draft |
| why_it_matters | A narrow suitable tool can reduce errors and unnecessary access compared with using a broad capability for every step. | 与每一步都使用宽泛能力相比，适用范围较窄的工具可减少错误和不必要的访问。 | draft |
| when_to_use | Use it when choosing between searching filenames, reading a known file, and querying a service. | 在搜索文件名、读取已知文件和查询服务之间选择时使用。 | draft |
| anti_pattern | Running a broad shell command when a scoped read operation would answer the question. | 本可通过限定范围的读取回答问题，却执行宽泛的 shell 命令。 | draft |

## Tool (tool)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Give the agent a capability for doing real work. | 提供智能体实际完成工作的能力。 | draft |
| definition | A tool is an externally implemented capability an agent can invoke to obtain information or perform an action. Its interface defines inputs and outputs; the runtime decides whether and how the requested operation executes. | 工具是外部实现的能力，智能体可调用它获取信息或执行操作。接口定义输入和输出；运行时决定请求的操作是否执行以及如何执行。 | draft |
| why_it_matters | Tools connect generated decisions to observable information and effects beyond the model's text response. | 工具将生成的决策连接到模型文字响应之外的可观察信息和实际影响。 | draft |
| when_to_use | Use one to read a file, query a service, or run a bounded validation command. | 读取文件、查询服务或执行限定范围的验证命令时使用。 | draft |
| anti_pattern | Assuming a model's description of a tool action means that the action actually executed. | 假定模型描述了工具操作，就意味着操作确实已执行。 | draft |

## Working Memory (working-memory)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Remember what matters for the current task. | 保留当前任务所需的信息。 | draft |
| definition | Working memory holds the facts, intermediate results, and unresolved decisions needed during a task. It can live in active context or an external scratchpad; it is not automatically a durable record for future tasks. | 工作记忆保存任务执行期间需要的事实、中间结果和未决事项。它可以位于活动上下文或外部工作笔记中；它不会自动成为供未来任务使用的持久记录。 | draft |
| why_it_matters | Keeping a concise current picture prevents repeated investigation and loss of pending obligations during a long sequence of actions. | 简明地保留当前情况，可避免在长操作序列中重复调查或遗漏待履行事项。 | draft |
| when_to_use | Use it to track hypotheses, completed checks, and the next unresolved issue while debugging. | 调试时跟踪假设、已完成检查和下一个未解决问题时使用。 | draft |
| anti_pattern | Using the full conversation as the only representation of current progress. | 仅用完整对话表示当前进度。 | draft |

## Feedback (feedback)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Use the result to choose the next useful move. | 根据结果选择下一项有效行动。 | draft |
| definition | Feedback is information about a result that informs a subsequent decision or adjustment. It may come from a user, a test, or the environment; it becomes useful when connected to the objective and a possible response. | 反馈是用于指导后续决策或调整的结果信息。它可以来自用户、测试或环境；当反馈与目标和可行响应相连接时，才能发挥作用。 | draft |
| why_it_matters | A process that incorporates outcome signals can correct mistakes instead of repeatedly executing an ineffective approach. | 将结果信号纳入过程，可纠正错误，避免反复执行无效方法。 | draft |
| when_to_use | Use it to adjust an implementation after a failing test identifies behavior that misses a requirement. | 失败测试指出某种行为未满足要求后，据此调整实现时使用。 | draft |
| anti_pattern | Collecting reviewer comments but continuing with the same action regardless of what they say. | 收集审阅意见，却无论意见内容如何都继续执行相同行动。 | draft |

## Observation (observation)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Look at what really happened after an action. | 观察行动后实际发生的情况。 | draft |
| definition | An observation is information received from the environment, such as a tool result, file contents, or a measured status. It records what was exposed at a time and scope; interpreting its meaning is a separate step. | 观察是从环境接收的信息，例如工具结果、文件内容或测得的状态。它记录特定时间和范围内呈现的信息；解释其含义是另一个步骤。 | draft |
| why_it_matters | Agents need external signals to distinguish intended effects from actual outcomes and notice changing conditions. | 智能体需要外部信号，以区分预期影响和实际结果，并发现条件变化。 | draft |
| when_to_use | Use it to inspect a command's exit status and output before deciding whether the step succeeded. | 在判断步骤是否成功前，检查命令退出状态和输出时使用。 | draft |
| anti_pattern | Treating the planned effect of an action as though it had already been observed. | 把操作计划产生的影响当作已经观察到的结果。 | draft |

## Trace (trace)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Keep a record of the agent's observable actions. | 保留智能体可观察行动的记录。 | draft |
| definition | A trace records observable execution events and their relationships, such as tool requests, results, timings, and state transitions. It supports investigation of behavior; it need not expose or reconstruct private model reasoning. | 追踪记录可观察执行事件及其关系，例如工具请求、结果、耗时和状态转换。它支持行为调查，无需暴露或重建模型的私有推理。 | draft |
| why_it_matters | A connected event record makes it easier to locate failures and relate a final result to the actions that produced it. | 相互关联的事件记录让故障定位更容易，也让最终结果能与产生它的操作相联系。 | draft |
| when_to_use | Use it to investigate which tool call introduced an incorrect value during a multi-step run. | 调查多步骤运行中哪次工具调用引入错误值时使用。 | draft |
| anti_pattern | Logging only the final answer and calling it a complete execution trace. | 仅记录最终答案，并称其为完整执行追踪。 | draft |

## Verification (verification)

| Unit | Canonical English | Chinese | Status |
| --- | --- | --- | --- |
| summary | Check whether the requirements were truly met. | 检查要求是否确实得到满足。 | draft |
| definition | Verification checks a result against explicit requirements using appropriate inspection, tests, or observed evidence. It concerns a defined claim and scope; checking one component cannot establish all properties of the complete system. | 验证通过适当检查、测试或观察证据，将结果与明确要求比较。验证针对明确的主张和范围；检查一个组件无法证明完整系统的全部属性。 | draft |
| why_it_matters | Completion becomes meaningful when acceptance criteria are checked rather than inferred from the amount of work performed. | 完成只有在验收标准经过检查时才具有意义，不能仅根据已投入工作量推断。 | draft |
| when_to_use | Use it before delivering a change to confirm the requested behavior and relevant constraints. | 交付变更前确认所需行为和相关约束时使用。 | draft |
| anti_pattern | Declaring success because a file was edited without checking the resulting behavior. | 只因为文件已经编辑就宣称成功，却未检查实际行为。 | draft |
