# Remaining concept translations

All rows are new drafts. Canonical English is the translation source. The previous approved batch is excluded from this comparison.

## Agent Loop (agent-loop)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The recurring cycle in which an agent observes state, chooses an action, executes it, and incorporates the result into its next decision. | 智能体观察状态、选择操作、执行操作，并将结果纳入下一次决策的循环。 |
| definition | An agent loop is the control structure that turns a model call into an adaptive process. A robust loop makes observations, decisions, actions, stopping conditions, and errors explicit rather than hiding them inside an open-ended conversation. | 智能体循环是一种控制结构，使单次模型调用成为可适应的过程。可靠的循环明确呈现观察、决策、行动、停止条件和错误，避免将它们隐藏在无止境的对话中。 |
| why_it_matters | Reliability problems often live between model calls. Exposing the loop makes retries, budgets, termination, tracing, and human intervention testable. | 可靠性问题常发生在模型调用之间。明确循环结构后，重试、预算、终止、追踪和人工干预才能被测试。 |
| when_to_use | Use it for tasks that require multiple dependent actions or adaptation to tool results. | 用于需要多项相互依赖的行动，或需要根据工具结果调整的任务。 |
| anti_pattern | Repeating model calls indefinitely without a progress measure, stop condition, or failure state. | 无限重复模型调用，却没有进度指标、停止条件或失败状态。 |

## Agent-ready Organization (agent-ready-organization)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | An organization whose processes, permissions, knowledge, and accountability are structured so agents can contribute safely and measurably. | 将过程、权限、知识和责任组织清楚，使智能体能够安全且可衡量地参与工作的组织。 |
| definition | An agent-ready organization has explicit process states, accessible authoritative knowledge, scoped credentials, observable outcomes, exception owners, and feedback loops. It changes the operating environment instead of merely adding chat interfaces to undocumented work. | 具备智能体就绪条件的组织具有明确过程状态、可访问的权威知识、范围受限的凭据、可观察结果、异常责任人和反馈回路。它改善运行环境，而非仅给未文档化的工作加上聊天界面。 |
| why_it_matters | Agents amplify the clarity or disorder already present in a system. Operational readiness determines whether automation produces leverage or faster confusion. | 智能体会放大系统已有的清晰程度或混乱程度。运行准备程度决定自动化能提高效能，还是只让混乱更快发生。 |
| when_to_use | Use it when assessing whether a team or process is prepared for consequential agent deployment. | 评估团队或过程是否已准备好部署会产生重大影响的智能体时使用。 |
| anti_pattern | Buying an agent platform before defining process ownership, source-of-truth data, and escalation paths. | 尚未定义过程责任、权威数据和升级路径，就购买智能体平台。 |

## Approval (approval)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Ask for authorization before specified important actions. | 在规定的重要操作之前取得授权。 |
| definition | Approval is a decision by an authorized person or policy process to allow a particular action or scope of work. It may be required in addition to technical permission and should identify what the approver is accepting. | 批准是有权的人或策略过程作出的决定，允许某项具体操作或某个工作范围。技术权限之外仍可能需要批准，且应明确批准者接受的内容。 |
| why_it_matters | Review at consequential boundaries keeps action aligned with human intent when existing authority is insufficient. | 当已有授权不足时，在重大影响边界进行审阅可使行动符合人的意图。 |
| when_to_use | Use it before an action whose defined policy requires a person to review the concrete proposed result. | 策略规定必须由人审阅具体拟议结果后才能执行操作时使用。 |
| anti_pattern | Treating silence or elapsed time as acceptance of a pending approval request. | 把沉默或经过一段时间当作对待处理批准请求的接受。 |

## Artifact (artifact)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Save useful things created while doing the work. | 保存工作过程中产生的有用产物。 |
| definition | An artifact is an identifiable output of work, such as a report, patch, dataset, or image. It can be inspected or passed onward independently of the conversation; its existence alone does not prove it meets requirements. | 产物是具有明确身份的工作输出，例如报告、补丁、数据集或图像。它能够脱离对话被独立检查或交接；产物存在本身不能证明它满足要求。 |
| why_it_matters | Persistent outputs make agent work reviewable and reusable by people, later steps, and other systems. | 持久保存的输出让人、后续步骤和其他系统能够审阅并复用智能体的工作。 |
| when_to_use | Use it to deliver a report as a saved file with a stable reference and appropriate format. | 以保存文件的形式交付报告，并提供稳定引用和适当格式时使用。 |
| anti_pattern | Claiming a report is delivered when only a description of the intended report exists. | 仅存在对预期报告的描述，就声称报告已经交付。 |

## Bounded Autonomy (bounded-autonomy)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Granting an agent freedom to choose actions only within explicit limits on scope, tools, time, cost, and reversibility. | 允许智能体仅在范围、工具、时间、成本和可逆性方面的明确限制内，自主选择行动。 |
| definition | Bounded autonomy defines an operating envelope rather than a binary choice between automation and approval. Within the envelope an agent may adapt and recover independently; crossing a boundary requires escalation, renewed authority, or a safer alternative. | 有界自主定义一个运行范围，而非将自动化与批准视为二选一。在范围内，智能体可以独立调整和恢复；跨越边界则需要升级、重新取得授权或选择更安全的替代方案。 |
| why_it_matters | Useful agents need room to act, but unconstrained action makes failures hard to contain. Bounds turn trust into an enforceable system property. | 有用的智能体需要行动空间，但不受限的操作会使失败难以控制。明确边界让信任成为可强制执行的系统属性。 |
| when_to_use | Use it whenever an agent can change external state, spend resources, contact people, or run for an extended period. | 智能体能够改变外部状态、消耗资源、联系人或长期运行时使用。 |
| anti_pattern | Describing an agent as supervised while enforcing no technical limit on what it can do. | 将智能体描述为受到监督，却未对其行为施加技术限制。 |

## Budget (budget)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Limit time, tokens, money, or tool calls for work. | 限制工作的时间、令牌、资金或工具调用次数。 |
| definition | A budget bounds one or more resources available to a task, such as duration, token use, spending, or invocations. Useful enforcement tracks consumption and defines what happens at the limit; a target alone is not a hard cap. | 预算限制任务可使用的一项或多项资源，例如持续时间、令牌用量、支出或调用次数。有效执行预算需要跟踪消耗，并定义达到限制后的处理方式；仅设目标不能构成硬性上限。 |
| why_it_matters | Explicit limits keep open-ended execution from consuming resources indefinitely and force decisions about useful remaining work. | 明确限制可避免开放式执行无限消耗资源，并促使系统判断剩余工作是否有用。 |
| when_to_use | Use it to cap an agent run and reserve enough capacity to report results or save resumable state. | 限制一次智能体运行，并预留报告结果或保存可恢复状态的容量时使用。 |
| anti_pattern | Continuing to call tools after the limit while merely noting that the budget was exceeded. | 超出上限后继续调用工具，只记录预算已经超支。 |

## Checkpoint and Resume (checkpoint-resume)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Persisting enough validated state for an agent workflow to continue after interruption without replaying unsafe or expensive work. | 持久保存足够的已验证状态，使智能体工作流能够在中断后继续，无需重复不安全或昂贵的工作。 |
| definition | A checkpoint records completed effects, pending decisions, load-bearing facts, budgets, artifacts, and the next valid transition. Resume logic verifies that external assumptions still hold before continuing from that state. | 检查点记录已完成影响、待定决策、承重事实、预算、产物和下一个有效状态转换。恢复逻辑在继续之前验证外部假设是否仍然成立。 |
| why_it_matters | Long-running agents will encounter restarts, approvals, rate limits, and human pauses. Durable checkpoints make interruption an expected transition rather than an exceptional failure. | 长期运行的智能体会遇到重启、批准等待、速率限制和人工暂停。持久检查点使中断成为预期转换，而非异常失败。 |
| when_to_use | Use it in workflows lasting beyond one request or containing costly and irreversible steps. | 用于持续超过单次请求，或包含高成本、不可逆步骤的工作流。 |
| anti_pattern | Saving only the conversation transcript and assuming it is an authoritative record of committed side effects. | 仅保存对话记录，并假定它是已提交副作用的权威记录。 |

## Checkpoint (checkpoint)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Save a place the agent can return to later. | 保存一个智能体以后可以返回的执行位置。 |
| definition | A checkpoint is a saved representation of execution state at a known boundary, sufficient for a defined form of resumption. It must identify what is complete and which side effects may already have occurred outside the saved state. | 检查点是在明确边界处保存的执行状态表示，足以支持规定形式的恢复。它必须说明哪些工作已完成，以及哪些副作用可能已经在保存状态之外发生。 |
| why_it_matters | A restart point limits repeated work after interruption and helps prevent replaying actions that already changed the outside world. | 重启点可减少中断后的重复工作，并帮助避免再次执行已改变外部世界的操作。 |
| when_to_use | Use it after a completed batch before beginning the next stage of a long task. | 长任务完成一批工作后、开始下一阶段之前使用。 |
| anti_pattern | Saving conversation text without recording which external writes actually succeeded. | 保存对话文字，却未记录哪些外部写入实际成功。 |

## Context Hygiene (context-hygiene)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The ongoing removal, correction, and separation of stale, duplicated, untrusted, or irrelevant information in an AI workflow. | 持续移除、纠正和分离 AI 工作流中过时、重复、不可信或无关的信息。 |
| definition | Context hygiene is the operational discipline of keeping active context accurate and purposeful. It includes labeling untrusted input, expiring stale state, deduplicating evidence, separating observations from instructions, and refreshing assumptions after external changes. | 上下文卫生是让活动上下文准确且服务于目标的操作纪律。它包括标记不可信输入、使过时状态失效、去除重复证据、区分观察与指令，以及在外部变化后更新假设。 |
| why_it_matters | Context quality degrades over time even when token limits are not reached. Hygiene prevents old plans and contaminated evidence from silently steering new decisions. | 即使未达到令牌限制，上下文质量也会随时间下降。持续维护可防止旧计划和受污染证据悄然影响新决策。 |
| when_to_use | Use it in persistent agents, collaborative sessions, changing environments, and any workflow that incorporates external text. | 用于持久智能体、协作会话、变化环境，以及纳入外部文字的工作流。 |
| anti_pattern | Appending every observation forever and relying on the model to resolve contradictions by itself. | 无限追加每个观察结果，并依赖模型自行解决矛盾。 |

## Context Pruning (context-pruning)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Remove what is no longer useful from active context. | 从活动上下文中移除不再有用的内容。 |
| definition | Context pruning removes selected material from the active input, such as obsolete tool results or repeated messages. Unlike compression, it drops material rather than summarizing it; source history may remain stored elsewhere. | 上下文裁剪从活动输入中移除选定材料，例如过时工具结果或重复消息。它直接舍弃内容，无需像压缩那样生成摘要；来源历史仍可保存在其他位置。 |
| why_it_matters | Removing irrelevant history reduces distraction and token use while keeping the remaining working context focused. | 移除无关历史能减少干扰和令牌消耗，使剩余工作上下文更集中。 |
| when_to_use | Use it after a resolved error leaves several redundant stack traces in an ongoing session. | 会话中某个错误已解决，但留下多个重复堆栈记录时使用。 |
| anti_pattern | Discarding an unresolved constraint simply because it appeared early in the conversation. | 仅因未解决约束出现在对话早期，就将其丢弃。 |

## Context Refresh (context-refresh)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Replace old information with newer verified facts. | 用更新且已验证的事实替换旧信息。 |
| definition | Context refresh updates active information by checking a current source and replacing or qualifying stale observations. It concerns freshness, not just making space, and should retain when and where a fact was checked. | 上下文刷新通过检查当前来源，替换过时观察或说明其限制，以更新活动信息。它关注时效性，范围超出腾出空间，并应保留事实的核对时间和位置。 |
| why_it_matters | A previously correct observation can become wrong after another actor edits a file or an external system changes state. | 其他主体编辑文件或外部系统改变状态后，原本正确的观察可能变错。 |
| when_to_use | Use it to reread a pull request's current status before deciding the next action. | 决定下一步之前，重新读取拉取请求的当前状态时使用。 |
| anti_pattern | Reusing a cached status after a known change without checking the authoritative source. | 已知发生变化后，仍复用缓存状态而不检查权威来源。 |

## Coordination (coordination)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Help agents avoid getting in each other's way. | 帮助多个智能体避免相互妨碍。 |
| definition | Coordination aligns actors through ownership, dependencies, communication, and conflict-resolution rules. It can be centralized or distributed; orchestration is one way to organize control flow within this broader concern. | 协调通过责任归属、依赖、沟通和冲突解决规则使行动主体保持一致。它可以集中或分布式实施；编排是在这一更广泛问题中组织控制流的一种方法。 |
| why_it_matters | Multiple capable workers can still duplicate effort or corrupt shared outputs unless their interactions are managed. | 若缺少交互管理，多个有能力的工作者仍可能重复劳动或破坏共享输出。 |
| when_to_use | Use it when agents contribute independent changes that must be combined into a coherent final result. | 多个智能体贡献独立变更，并需组合成一致最终结果时使用。 |
| anti_pattern | Starting parallel workers without defining write boundaries or responsibility for integration. | 启动并行工作者，却未规定写入边界或集成责任。 |

## Delegation Contract (delegation-contract)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A precise agreement defining the outcome, authority, evidence, escalation rules, and completion condition for delegated work. | 明确规定委派工作的结果、权限、证据、升级规则和完成条件的约定。 |
| definition | A delegation contract packages what must be achieved, what may be changed, which resources are available, how progress is judged, when to ask for help, and what artifacts constitute completion. It applies to human-agent and agent-agent delegation. | 委派契约说明必须实现什么、可以改变什么、有哪些可用资源、如何判断进展、何时求助，以及哪些产物构成完成。它适用于人与智能体之间及智能体之间的委派。 |
| why_it_matters | Ambiguous delegation produces activity without accountability. A contract lets the delegate adapt methods while preserving the principal's intent and limits. | 含糊的委派产生大量活动，却缺少责任依据。契约允许受托方调整方法，同时保留委派方的意图和限制。 |
| when_to_use | Use it whenever responsibility crosses a human, team, agent, or execution boundary. | 责任跨越个人、团队、智能体或执行边界时使用。 |
| anti_pattern | Assigning a broad goal with no authority limits or acceptance evidence, then judging success after the fact. | 只给宽泛目标，不设权限限制或验收证据，事后才判断成功。 |

## Delegation (delegation)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Give part of the work to another worker. | 将一部分工作交给其他工作者。 |
| definition | Delegation assigns a scoped portion of work to another actor with the information and authority needed to perform it. The delegator still needs an integration and acceptance process; assignment alone does not ensure a usable result. | 委派将范围明确的一部分工作交给另一个主体，同时提供完成工作所需的信息和权限。委派方仍需安排集成和验收；仅分配工作无法保证结果可用。 |
| why_it_matters | Specialized workers can contribute effectively when ownership, output expectations, and dependencies are explicit. | 明确责任归属、输出预期和依赖后，专门工作者才能有效贡献。 |
| when_to_use | Use it to assign an independent analysis while retaining responsibility for the final synthesis. | 分配独立分析，同时保留对最终综合结果的责任时使用。 |
| anti_pattern | Asking several agents to handle the problem without defining who owns which deliverable. | 让多个智能体处理问题，却未规定各自产物的负责人。 |

## Deterministic Shell (deterministic-shell)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A predictable software boundary that validates, executes, records, and constrains actions proposed by a probabilistic model. | 对概率模型提出的操作进行验证、执行、记录和限制的可预测软件边界。 |
| definition | The deterministic shell converts model proposals into typed operations, checks permissions and invariants, applies timeouts and budgets, and records outcomes. The model may decide what should happen; the shell decides whether and exactly how it can happen. | 确定性外壳将模型提议转换为带类型的操作，检查权限和不变量，施加超时与预算，并记录结果。模型可判断应发生什么；外壳决定操作是否允许，以及具体如何发生。 |
| why_it_matters | Probabilistic reasoning is valuable, but side effects require repeatable controls. The shell provides a stable place for guarantees and incident evidence. | 概率推理具有价值，但副作用需要可重复的控制。外壳为保证条件和事件证据提供稳定位置。 |
| when_to_use | Use it around file changes, API calls, payments, deployments, messages, or any other consequential tool. | 用于文件变更、API 调用、付款、部署、消息或其他有重大影响的工具操作。 |
| anti_pattern | Letting free-form model text flow directly into privileged execution without validation. | 未经验证，就让自由格式的模型文字直接进入特权执行。 |

## Eval-driven Development (eval-driven-development)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Developing AI behavior through explicit task examples, scoring criteria, and regression evaluation rather than intuition alone. | 通过明确任务示例、评分标准和回归评估开发 AI 行为，减少对直觉的单独依赖。 |
| definition | Eval-driven development makes representative cases and measurable outcomes part of the design loop. Changes to prompts, models, tools, retrieval, or orchestration are compared against the same behavioral expectations before release. | 评估驱动开发把代表性案例和可衡量结果纳入设计循环。发布前，针对相同的行为预期比较提示、模型、工具、检索或编排的变更。 |
| why_it_matters | AI failures are distributional and can move when one case improves. Evals turn subjective quality claims into repeatable evidence and reveal regressions early. | AI 故障与输入分布有关，改善一个案例可能让故障转移。评估使主观质量主张成为可重复证据，并提前揭示回归。 |
| when_to_use | Use it for any AI feature whose quality depends on behavior rather than only deterministic code paths. | 用于质量依赖行为表现，且无法仅靠确定性代码路径判断的 AI 功能。 |
| anti_pattern | Shipping based on a handful of impressive demonstrations selected by the builder. | 根据开发者挑选的少量精彩演示就发布。 |

## Evidence (evidence)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Show support that the work was really done. | 提供能够检查的支撑，说明工作是否确实完成。 |
| definition | Evidence is inspectable information supporting or challenging a specific claim, such as test output or an observed state change. Its strength depends on relevance, provenance, and scope; a success message is not universal proof. | 证据是可检查的信息，用于支持或质疑某项具体主张，例如测试输出或观察到的状态变化。其强度取决于相关性、来源和范围；成功消息无法构成普遍证明。 |
| why_it_matters | Reviewers need a basis for accepting completion claims without reconstructing every action or trusting the agent's confidence. | 审阅者需要依据接受完成主张，避免重建每项行动或依赖智能体的自信。 |
| when_to_use | Use it to support a bug-fix claim with a reproduction and a passing check of the corrected behavior. | 用可复现问题和修正后行为的通过检查支撑修复主张时使用。 |
| anti_pattern | Presenting an unrelated passing test as proof that every requested behavior works. | 用无关的通过测试证明所有请求行为都正常。 |

## Failure Containment (failure-containment)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Structuring an AI system so that an incorrect decision or failed component has a limited, observable, and recoverable blast radius. | 设计 AI 系统，使错误决策或组件失败的影响范围有限、可观察且可恢复。 |
| definition | Failure containment combines narrow permissions, isolated workspaces, budgets, transactional boundaries, circuit breakers, and escalation paths. It assumes some model and tool failures will occur and designs the surrounding system to prevent cascade. | 故障遏制结合狭窄权限、隔离工作区、预算、事务边界、熔断器和升级路径。它假定模型与工具会发生部分故障，并通过周边系统设计避免级联影响。 |
| why_it_matters | Average accuracy does not describe the cost of a rare consequential error. Containment makes residual uncertainty operationally tolerable. | 平均准确率无法说明罕见重大错误的成本。遏制措施使剩余不确定性在运行中可承受。 |
| when_to_use | Use it wherever an agent performs repeated actions, controls shared resources, or depends on unreliable external systems. | 用于智能体反复操作、控制共享资源或依赖不可靠外部系统的场景。 |
| anti_pattern | Relying on the agent to notice and correct its own error after unrestricted side effects have spread. | 让副作用不受限制地扩散，再依赖智能体自行发现并纠正错误。 |

## Fallback (fallback)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Use another way when the first way fails. | 首选方法失败时采用其他方法。 |
| definition | A fallback switches to an alternative method or capability when the preferred path cannot succeed. It differs from retrying the same operation and must preserve required constraints or explicitly surface reduced capability. | 回退在首选路径无法成功时，改用替代方法或能力。它与重试同一操作不同，必须保留必要约束，或明确说明能力降低。 |
| why_it_matters | An alternative path can keep useful work moving while making any loss of fidelity or coverage visible. | 替代路径可以让有用工作继续，同时让保真度或覆盖范围的损失可见。 |
| when_to_use | Use it when a primary retrieval service is unavailable and an approved alternate source can answer the request. | 主要检索服务不可用，但已获准替代来源可以回答请求时使用。 |
| anti_pattern | Silently replacing an authoritative lookup with an unsupported guess. | 悄然用无依据猜测替代权威查询。 |

## Forgetting (forgetting)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Remove old or low-value memories from future use. | 让过时或价值较低的记忆退出未来使用。 |
| definition | Forgetting retires, deletes, or excludes stored information from future retrieval according to retention and relevance rules. Unlike context pruning, it changes future memory availability; deleting a note does not erase model training data. | 遗忘按照保留和相关性规则，退役、删除存储信息，或将其排除在未来检索之外。它改变未来记忆可用性，与上下文裁剪不同；删除笔记不会擦除模型训练数据。 |
| why_it_matters | Memory that never expires can preserve obsolete assumptions and retain information beyond the period in which it is useful. | 永不过期的记忆可能保留过时假设，并让信息存留超过其有用期限。 |
| when_to_use | Use it to retire superseded project guidance or implement an agreed memory retention period. | 退役已被替代的项目指导，或执行已约定的记忆保留期限时使用。 |
| anti_pattern | Deleting a visible note while leaving its duplicate indexed and available for retrieval. | 删除可见笔记，却让重复内容继续被索引和检索。 |

## Goal (goal)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Tell the agent where the work should end up. | 说明工作应达到的结果。 |
| definition | A goal describes the desired outcome and the conditions under which it is satisfied. It guides action selection without necessarily prescribing every step; constraints determine which paths to the outcome are acceptable. | 目标描述期望结果及其满足条件。它指导行动选择，无需规定每个步骤；约束决定哪些实现路径可接受。 |
| why_it_matters | An explicit destination helps the agent evaluate progress and stop when further activity no longer serves the request. | 明确目的地帮助智能体评估进度，并在后续活动不再服务请求时停止。 |
| when_to_use | Use it to define a successful migration in terms of preserved behavior and accepted validation results. | 通过行为保持和验收通过的条件定义迁移成功时使用。 |
| anti_pattern | Using an activity such as keep improving as the only definition of success. | 仅用持续改进等活动作为成功定义。 |

## Golden Trace (golden-trace)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A curated end-to-end record of a good agent run used as a review reference, regression fixture, or behavioral specification. | 精心策划的良好智能体运行全程记录，可用作审阅参考、回归用例或行为规格。 |
| definition | A golden trace captures the relevant observations, decisions, tool calls, state transitions, evidence, and final outcome of a representative task. It evaluates the path as well as the answer, while allowing explicitly marked nondeterministic variation. | 黄金轨迹记录代表性任务的相关观察、决策、工具调用、状态转换、证据和最终结果。它同时评估过程和答案，并允许明确标记的非确定性变化。 |
| why_it_matters | Final-output tests miss unsafe or wasteful paths that happen to end correctly. Traces expose how the system reached the result and anchor debugging discussions. | 仅测最终输出会遗漏碰巧得出正确结果的不安全或浪费路径。追踪呈现结果形成过程，并为调试讨论提供依据。 |
| when_to_use | Use it for critical workflows, incident reproductions, onboarding examples, and changes to the agent loop. | 用于关键工作流、事件复现、入门示例或智能体循环变更。 |
| anti_pattern | Freezing incidental wording or timestamps so tightly that the trace rejects harmless variation. | 过度固定偶然措辞或时间戳，使追踪拒绝无害变化。 |

## Graceful Intervention (graceful-intervention)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The ability for a person to pause, redirect, correct, or take over an agent workflow without corrupting state or losing completed work. | 允许人在不损坏状态、不丢失已完成工作的情况下，暂停、转向、纠正或接管智能体工作流。 |
| definition | Graceful intervention treats human input as a normal control transition. The system reaches or creates a safe point, reports committed effects, preserves relevant context, accepts changed intent, and resumes or hands over with clear ownership. | 优雅干预将人工输入视为正常控制转换。系统到达或创建安全点，报告已提交影响，保留相关上下文，接受意图变更，并以明确责任归属恢复或交接。 |
| why_it_matters | Real goals and external conditions change during execution. Intervention controls prevent users from choosing between passive waiting and destructive cancellation. | 实际目标和外部条件会在执行中变化。干预控制使用户无需在被动等待和破坏性取消之间二选一。 |
| when_to_use | Use it for long-running, costly, or consequential tasks where mid-course correction is likely. | 用于长期、高成本或重大影响任务，尤其是可能需要中途纠正的工作。 |
| anti_pattern | Offering only a stop button that abandons state and leaves partial side effects unexplained. | 仅提供停止按钮，放弃状态，却未解释部分副作用。 |

## Grounding (grounding)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Check ideas against evidence from the real world. | 根据现实证据检查主张与决策。 |
| definition | Grounding connects a claim or decision to relevant external information, such as source text, measurements, or observed system state. Sources can be incomplete or wrong, so the connection must be assessed rather than assumed. | 事实锚定将主张或决策连接到相关外部信息，例如来源文字、测量或观察到的系统状态。来源可能不完整或有误，因此必须评估该连接，不能直接假定它有效。 |
| why_it_matters | Explicit support reduces reliance on plausible-sounding generation and makes claims easier to inspect and challenge. | 明确支撑可减少对看似合理的生成内容的依赖，并使主张更容易检查和质疑。 |
| when_to_use | Use it to link a factual answer to a current source that actually supports the specific statement. | 将事实性答案关联到真正支撑具体表述的当前来源时使用。 |
| anti_pattern | Adding a citation that mentions the topic but does not support the asserted claim. | 添加只提及主题、却未支撑所述主张的引用。 |

## Human on the Loop (human-on-the-loop)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A supervision model in which an agent acts independently inside bounds while a human monitors evidence and can intervene or change policy. | 智能体在边界内独立行动，人通过监测证据进行监督，并可干预或改变策略的监督模式。 |
| definition | Human-on-the-loop supervision differs from approving every action. The human receives meaningful status, exceptions, and audit evidence, while the system provides pause, redirect, rollback, and escalation controls at suitable points. | 人在环上监督与逐项批准不同。人获得有意义的状态、异常和审计证据；系统在合适位置提供暂停、转向、回滚和升级控制。 |
| why_it_matters | Per-action approval does not scale, but removing human leverage creates unacceptable risk. On-the-loop design preserves oversight without turning the person into a click-through bottleneck. | 逐项批准无法随规模扩展，但取消人的控制能力会造成不可接受风险。人在环上设计保留监督，同时避免人变成只点确认的瓶颈。 |
| when_to_use | Use it for high-volume operations where most actions are routine but exceptions are consequential. | 用于多数行动常规化、但异常影响重大的高吞吐操作。 |
| anti_pattern | Calling a dashboard oversight when it cannot pause the agent or explain what requires attention. | 将无法暂停智能体、也无法解释何处需要关注的仪表盘称为监督。 |

## Idempotent Action (idempotent-action)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | An operation designed so that safely repeating it produces no additional unintended effect beyond the first successful application. | 经过设计的操作，使其安全重复不会在首次成功应用之外产生额外的非预期影响。 |
| definition | Idempotent actions use stable identifiers, precondition checks, deduplication keys, or desired-state semantics to make retries safe. When true idempotence is impossible, the operation should expose its commit state and compensating path. | 幂等操作通过稳定标识符、前置条件检查、去重键或目标状态语义，让重试安全。无法实现真正幂等性时，操作应呈现提交状态和补偿路径。 |
| why_it_matters | Agents retry after timeouts, partial failures, and uncertain observations. Without idempotence, recovery can duplicate messages, payments, records, or destructive changes. | 智能体会在超时、部分失败和不确定观察后重试。缺少幂等性时，恢复可能重复消息、付款、记录或破坏性变更。 |
| when_to_use | Use it for every externally visible action that may be retried or resumed. | 用于可能被重试或恢复的每项外部可见操作。 |
| anti_pattern | Retrying a state-changing request after a timeout without knowing whether the first attempt committed. | 状态变更请求超时后，不知道首次尝试是否已提交就重试。 |

## Inspectable Agency (inspectable-agency)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The property that an agent's current objective, state, evidence, actions, and authority can be understood by a responsible observer. | 使负责监督的人能够理解智能体当前目标、状态、证据、行动和权限的属性。 |
| definition | Inspectable agency exposes the operational story of a run without requiring users to read raw chain-of-thought. It presents plans, tool activity, source evidence, uncertainty, approvals, and meaningful state transitions at the right level of detail. | 可检视的能动性呈现运行过程，无需用户读取原始思维链。它以合适的详细程度展示计划、工具活动、来源证据、不确定性、批准和有意义的状态转换。 |
| why_it_matters | People cannot supervise what they cannot interpret. Inspectability supports trust calibration, intervention, debugging, and accountability without exposing private model internals. | 人无法监督无法理解的行为。可检查性支持校准信任、干预、调试和追责，无需暴露模型私有内部过程。 |
| when_to_use | Use it in agent products where actions unfold over time or affect external systems. | 用于行动随时间展开或影响外部系统的智能体产品。 |
| anti_pattern | Showing a theatrical stream of internal-looking text that does not correspond to enforceable state or real actions. | 展示看似内部思考的戏剧化文字流，却未对应可强制执行的状态或实际操作。 |

## Intent Interface (intent-interface)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A user interface that helps people express desired outcomes, constraints, and authority while the system determines appropriate steps. | 帮助人表达期望结果、约束和权限，由系统确定适当步骤的用户界面。 |
| definition | An intent interface shifts interaction from specifying every operation to defining the goal and its boundaries. It still lets users refine assumptions, inspect the proposed approach, and control consequential transitions rather than reducing everything to one prompt box. | 意图界面将交互重点从逐项指定操作转向定义目标及边界。它仍允许用户修正假设、检查拟议方法并控制重大状态转换，功能不限于一个提示输入框。 |
| why_it_matters | Agents can plan across tools, but users remain responsible for outcomes. Good intent capture reduces hidden assumptions and makes autonomy legible. | 智能体可跨工具规划，但用户仍负责结果。良好的意图采集减少隐含假设，并使自主行为易于理解。 |
| when_to_use | Use it for workflows where users know the desired result better than the exact sequence of operations. | 用于用户比精确操作顺序更了解所需结果的工作流。 |
| anti_pattern | Replacing a structured workflow with an empty chat box and expecting users to discover every necessary constraint. | 用空白聊天框替代结构化工作流，并要求用户自行发现全部必要约束。 |

## Load-bearing Facts (load-bearing-facts)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Facts whose loss, distortion, or displacement would materially change the correctness or safety of an AI system's next action. | 丢失、失真或移位后，会实质改变 AI 系统下一步行动正确性或安全性的事实。 |
| definition | Load-bearing facts are the small subset of context that a workflow must preserve across summarization, retrieval, and handoff. Examples include the user's actual objective, irreversible constraints, authorization state, identifiers, and verified external conditions. | 承重事实是工作流在摘要、检索和交接过程中必须保留的少量上下文。例如用户的实际目标、不可逆约束、授权状态、标识符和已验证的外部条件。 |
| why_it_matters | Long workflows naturally compress and transform context. Naming the facts that must survive creates a testable preservation requirement instead of trusting generic summaries. | 长工作流自然会压缩和转换上下文。明确必须保留的事实可形成可测试的保留要求，减少对通用摘要的盲目信任。 |
| when_to_use | Use it before summarization, delegation, checkpointing, or any transition that may discard working context. | 用于摘要、委派、检查点保存或任何可能丢弃工作上下文的转换之前。 |
| anti_pattern | Treating all prior messages as equally important and assuming a fluent summary preserved every constraint. | 认为所有历史消息同样重要，并假定流畅摘要保留了每项约束。 |

## Orchestration (orchestration)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | The coordination of agents, tools, state, and control flow so that specialized work converges on one accountable outcome. | 协调智能体、工具、状态和控制流，使专门工作汇聚为一个责任明确的结果。 |
| definition | Orchestration defines who or what acts next, which context is transferred, how partial results are combined, and what happens on delay or failure. It may be deterministic, model-directed, or hybrid, but its contracts should remain observable. | 编排规定谁或什么执行下一步、传递哪些上下文、如何合并部分结果，以及遇到延迟或失败时如何处理。它可由确定性逻辑、模型或混合方式驱动，但其契约应保持可观察。 |
| why_it_matters | Adding more agents multiplies coordination costs and failure paths. Explicit orchestration prevents parallel activity from being mistaken for progress. | 增加智能体会增加协调成本和失败路径。明确编排可避免将并行活动误当作进展。 |
| when_to_use | Use it when a task spans specialized roles, independent workstreams, or external systems with different timing. | 用于跨专门角色、独立工作流或具有不同时间特性的外部系统的任务。 |
| anti_pattern | Spawning many agents without ownership boundaries, merge rules, or a single completion criterion. | 启动多个智能体，却未规定责任边界、合并规则或统一完成标准。 |

## Parallelism (parallelism)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Do independent pieces of work at the same time. | 同时执行相互独立的工作。 |
| definition | Parallelism executes multiple work units concurrently where their dependencies and resource access allow it. Results still need combination and verification; overlapping work is not beneficial when tasks contend for the same mutable state. | 并行在依赖与资源访问条件允许时，同时执行多个工作单元。结果仍需合并和验证；任务争用同一可变状态时，重叠工作未必有益。 |
| why_it_matters | Independent tasks can finish sooner, but coordination costs and write conflicts can erase the benefit if boundaries are unclear. | 独立任务可更快完成，但边界不清时，协调成本和写入冲突可能抵消收益。 |
| when_to_use | Use it to analyze separate documents before combining their findings in a later synthesis. | 先分别分析文档，再在后续步骤综合发现时使用。 |
| anti_pattern | Running dependent edits simultaneously against the same files with no ownership or merge rules. | 在相同文件上同时执行有依赖的编辑，却未规定责任归属或合并规则。 |

## Permission Boundary (permission-boundary)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | An enforced boundary that separates actions an agent may take directly from those requiring different credentials, approval, or escalation. | 强制区分智能体可直接执行的操作，与需要其他凭据、批准或升级的操作的边界。 |
| definition | A permission boundary maps authority to specific resources and operations, ideally with least-privilege credentials and runtime checks. It distinguishes what the model proposes from what the system is actually capable of executing. | 权限边界将权限对应到具体资源和操作，宜采用最小权限凭据与运行时检查。它区分模型提议的操作和系统实际能够执行的操作。 |
| why_it_matters | Prompt instructions are not access control. Technical boundaries limit the impact of reasoning errors, prompt injection, and compromised external content. | 提示指令无法提供访问控制。技术边界限制推理错误、提示注入和受损外部内容的影响。 |
| when_to_use | Use it for every tool that reads sensitive data or changes external state. | 用于每个读取敏感数据或改变外部状态的工具。 |
| anti_pattern | Giving one long-lived administrator credential to an agent and expressing restrictions only in natural language. | 给智能体长期管理员凭据，仅用自然语言表述限制。 |

## Permission (permission)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Decide what the agent is allowed to access or do. | 决定智能体允许访问什么或执行什么。 |
| definition | A permission grants an actor access to a resource or operation within a defined scope. It is enforced by the system that controls the resource; a task request or model instruction does not itself create that access. | 权限授予主体在明确范围内访问资源或操作的能力。它由控制资源的系统执行；任务请求或模型指令本身不会创建这种访问权。 |
| why_it_matters | Scoped access limits the impact of mistakes and makes the boundary of authorized actions technically checkable. | 限定范围的访问可限制错误影响，并使已授权操作的边界在技术上可检查。 |
| when_to_use | Use it to give an agent read access to one project while withholding unrelated resources. | 授予智能体对一个项目的读取权限，同时限制无关资源时使用。 |
| anti_pattern | Granting broad write credentials for a task that only requires reading a single document. | 任务只需读取一份文档，却授予广泛写入凭据。 |

## Plan–Execute–Observe (plan-execute-observe)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | An execution discipline that separates intended actions, real side effects, and observed results into explicit stages. | 将预期操作、实际副作用和观察结果分成明确阶段的执行纪律。 |
| definition | Plan–execute–observe requires an agent to state or encode the next intended operation, run it through the execution boundary, and then update its state from the actual result. The observation, not the original expectation, drives the next step. | 规划—执行—观察要求智能体表述或编码下一项预期操作，经执行边界实施，再根据实际结果更新状态。下一步由观察结果驱动，避免由原始预期代替实际结果。 |
| why_it_matters | Separating stages makes failures local and visible. It prevents assumed success from contaminating later reasoning and creates natural points for policy checks. | 分阶段可使失败局部化且可见，避免假定成功污染后续推理，并提供自然的策略检查点。 |
| when_to_use | Use it for multi-step tool use, external APIs, infrastructure changes, and workflows with uncertain outcomes. | 用于多步骤工具使用、外部 API、基础设施变更及结果不确定的工作流。 |
| anti_pattern | Treating a proposed action as completed and continuing the plan without checking the result. | 把提议操作当作已完成，未检查结果就继续计划。 |

## Planning (planning)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Decide what steps may be needed to reach the goal. | 判断达到目标可能需要哪些步骤。 |
| definition | Planning proposes actions and dependencies that could achieve a goal under current assumptions. A plan is a revisable guide, not evidence that actions occurred or a guarantee that the environment will behave as expected. | 规划依据当前假设提出能够实现目标的行动及依赖。计划是可修订的指导，不能证明行动已发生，也无法保证环境按预期运行。 |
| why_it_matters | A visible sequence helps identify missing prerequisites and choose checks before costly work begins. | 可见的顺序有助于识别缺少的前提，并在高成本工作开始前选择检查。 |
| when_to_use | Use it before a migration with ordered preparation, execution, and validation stages. | 用于包含有序准备、执行和验证阶段的迁移之前。 |
| anti_pattern | Treating a detailed plan as completed work or refusing to revise it after contrary evidence. | 把详细计划视为已完成工作，或在相反证据出现后拒绝修订。 |

## Policy as Code (policy-as-code)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Expressing operational rules as versioned, testable, and enforceable logic rather than relying only on prose instructions. | 将操作规则表达为具有版本、可测试且可强制执行的逻辑，减少对文字指令的单独依赖。 |
| definition | Policy as code turns requirements such as approval thresholds, data access, action limits, and retention rules into deterministic checks around agent behavior. Natural-language guidance may explain the policy, but executable controls decide compliance. | 策略即代码将批准阈值、数据访问、行动限制和保留规则等要求，转换为约束智能体行为的确定性检查。自然语言指导可解释策略，但合规判断由可执行控制作出。 |
| why_it_matters | Versioned policies can be reviewed, tested, audited, and rolled back. They reduce ambiguity where probabilistic interpretation is inappropriate. | 具有版本的策略可被审阅、测试、审计和回滚，并减少不适合概率解释场景中的歧义。 |
| when_to_use | Use it when a rule protects money, data, infrastructure, legal commitments, or organizational authority. | 规则用于保护资金、数据、基础设施、法律承诺或组织权限时使用。 |
| anti_pattern | Duplicating policy fragments across prompts until no one can tell which version is enforced. | 在提示中重复分散的策略片段，最终无人能确定实际执行哪个版本。 |

## Progressive Autonomy (progressive-autonomy)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Expanding an agent's authority in measured stages as evidence accumulates that it performs safely and effectively within each stage. | 随着智能体在每个阶段内安全有效运行的证据累积，分阶段扩大其权限。 |
| definition | Progressive autonomy treats authority as earned and reversible. A workflow may begin in suggestion mode, advance to approval-gated execution, and later gain bounded automatic action based on evals, production evidence, and clear rollback triggers. | 渐进式自主把权限视为需要通过表现获得且能够撤回的能力。工作流可从建议模式开始，进入批准后执行，再依据评估、生产证据和明确回滚触发条件获得受限自动操作权限。 |
| why_it_matters | It aligns deployment risk with demonstrated capability. Teams can capture value early without making a single irreversible leap to full automation. | 它将部署风险与已展示能力匹配，让团队无需一次不可逆地跃迁到完全自动化，就能尽早获得价值。 |
| when_to_use | Use it when introducing agents into consequential workflows or broadening an existing agent's scope. | 用于将智能体引入重大影响工作流，或扩大现有智能体范围时。 |
| anti_pattern | Granting permanent broad access after a successful pilot with narrow, curated tasks. | 仅凭范围狭窄、任务经过挑选的成功试点，就永久授予广泛访问。 |

## Prompt (prompt)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Tell the agent what you want it to accomplish. | 说明希望智能体完成什么。 |
| definition | A prompt is the input that asks a model or agent for a response or action. It can contain a request, examples, and task data; it is not necessarily a persistent rule or the entire context. | 提示是请求模型或智能体响应或行动的输入。它可包含请求、示例和任务数据，但不一定是持久规则或全部上下文。 |
| why_it_matters | A clear request reduces ambiguity about the desired result and gives the agent a concrete basis for choosing its next action. | 清晰请求减少所需结果的歧义，并为智能体选择下一步提供具体依据。 |
| when_to_use | Use it to ask an agent to summarize a document with a specified audience and output format. | 请求智能体按指定受众和输出格式总结文档时使用。 |
| anti_pattern | Asking for something better without saying what outcome or constraints matter. | 只要求变得更好，却未说明重要结果或约束。 |

## Provenance Chain (provenance-chain)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A traceable chain connecting an AI system's claim or action to the evidence, transformations, and decisions that produced it. | 连接 AI 系统主张或操作与产生它们的证据、转换和决策的可追溯链。 |
| definition | A provenance chain records where information originated, when it was observed, how it was filtered or summarized, and which outputs depended on it. It preserves the distinction between primary evidence, inference, and model-generated interpretation. | 来源链记录信息从何处产生、何时观察到、如何被筛选或摘要，以及哪些输出依赖它。它保留原始证据、推断和模型生成解释之间的区别。 |
| why_it_matters | Without provenance, fluent outputs are difficult to verify or correct. A visible chain supports audits, debugging, user trust, and targeted invalidation when sources change. | 缺少来源信息时，流畅输出难以验证或纠正。可见来源链支持审计、调试、用户信任及来源变化后的定向失效。 |
| when_to_use | Use it for research, regulated decisions, incident response, generated datasets, and any output that may be challenged later. | 用于研究、受监管决策、事件响应、生成数据集，以及未来可能受到质疑的输出。 |
| anti_pattern | Attaching a list of links after generation without recording which claim each source actually supports. | 生成后附上一组链接，却未记录每个来源实际支持哪项主张。 |

## Recovery (recovery)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Continue work after an interruption or failure. | 在中断或失败后继续工作。 |
| definition | Recovery restores the ability to make progress after disruption by reconciling saved state with current reality. It may resume, retry, or choose another path; it must account for effects that occurred before the interruption. | 恢复将保存状态与当前现实核对，使过程在受扰后重新获得进展能力。它可以继续、重试或选择其他路径，但必须考虑中断前已经发生的影响。 |
| why_it_matters | A recoverable process avoids losing completed work or duplicating actions when execution stops unexpectedly. | 可恢复过程可在执行意外停止时保留已完成工作，并避免重复操作。 |
| when_to_use | Use it after a process restart to determine which steps completed and what can safely run next. | 过程重启后，确定哪些步骤已完成以及下一步哪些操作可安全运行时使用。 |
| anti_pattern | Restarting the entire workflow without checking which external actions already succeeded. | 重启整个工作流，却未检查哪些外部操作已经成功。 |

## Reflection (reflection)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Check whether the result and approach make sense. | 检查结果和方法是否合理。 |
| definition | Reflection examines a result or process to identify mistakes, gaps, and possible improvements. It may use model critique or explicit questions; self-critique is not independent evidence that the result is correct. | 反思检查结果或过程，以发现错误、缺口和改进机会。它可采用模型批评或明确问题；自我批评无法提供结果正确的独立证据。 |
| why_it_matters | Reviewing the approach can reveal faulty assumptions before they are repeated, especially when coupled with external checks. | 检查方法可在错误假设被重复前发现问题，尤其是在结合外部检查时。 |
| when_to_use | Use it after a failed attempt to compare the expected outcome with the observed result. | 一次失败尝试后，比较预期结果与观察结果时使用。 |
| anti_pattern | Accepting a model's reassuring self-assessment in place of checking the underlying work. | 用模型令人安心的自我评估替代对实际工作的检查。 |

## Replanning (replanning)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Change the plan when new facts change the task. | 新事实改变任务条件时调整计划。 |
| definition | Replanning revises the remaining actions or dependencies after new evidence, failure, or changed constraints. It should retain the authorized goal unless that goal is explicitly changed; it is not permission to expand scope. | 重新规划在新证据、失败或约束变化后，修订剩余行动及依赖。除非目标被明确改变，否则应保留已授权目标；重新规划不授予扩大范围的权限。 |
| why_it_matters | Adaptive work needs to abandon invalid assumptions without losing the user's original objective or repeating completed steps. | 可适应工作需要放弃无效假设，同时保留用户原始目标，并避免重复已完成步骤。 |
| when_to_use | Use it when a required dependency is unavailable and another supported path can satisfy the same goal. | 必要依赖不可用，但其他有依据的路径能够满足相同目标时使用。 |
| anti_pattern | Repeating an obsolete plan after evidence shows a prerequisite cannot be met. | 证据已表明前提无法满足，仍重复过时计划。 |

## Retrieval Contract (retrieval-contract)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | An explicit agreement about what retrieval must return, with which metadata, freshness, trust level, and failure behavior. | 明确约定检索必须返回什么，以及元数据、时效性、信任级别和失败行为。 |
| definition | A retrieval contract specifies query intent, eligible sources, ranking expectations, citation metadata, time constraints, and what the caller receives when confidence is low or evidence conflicts. It makes retrieval a typed dependency rather than an opaque search step. | 检索契约规定查询意图、可用来源、排序预期、引用元数据、时间约束，以及信心不足或证据冲突时调用方收到的内容。它让检索成为带类型的依赖，避免仅作为不透明搜索步骤。 |
| why_it_matters | Retrieval quality cannot be judged only by whether some text was returned. Contracts expose silent gaps and let downstream reasoning distinguish absence from failure. | 检索质量不能仅由是否返回文字判断。契约揭示隐藏缺口，让下游推理区分信息缺失与检索失败。 |
| when_to_use | Use it when AI decisions depend on search, RAG, enterprise knowledge, or rapidly changing external facts. | 用于 AI 决策依赖搜索、RAG、企业知识或快速变化外部事实的场景。 |
| anti_pattern | Passing top-k text chunks to the model with no source identity, timestamp, or empty-result semantics. | 向模型传递 top-k 文本块，却不提供来源身份、时间戳或空结果语义。 |

## Retry (retry)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Try an unsuccessful operation again when appropriate. | 在适当情况下再次尝试未成功的操作。 |
| definition | A retry repeats an operation after failure or an uncertain result under a bounded policy. It is appropriate for potentially transient problems, but must account for actions that may already have produced side effects. | 重试在失败或结果不确定后，按照有界策略重复操作。它适用于可能暂时性的问题，但必须考虑操作可能已经产生的副作用。 |
| why_it_matters | A controlled second attempt can overcome temporary failure without turning a brief outage into repeated writes or unbounded traffic. | 受控的再次尝试可克服临时失败，避免将短暂故障变成重复写入或无限流量。 |
| when_to_use | Use it for a transient read failure with a limit and delay between attempts. | 用于暂时性读取失败，并设置次数上限和尝试间延迟。 |
| anti_pattern | Repeating a payment or write after a timeout without checking whether the first attempt succeeded. | 付款或写入超时后，未检查首次尝试是否成功就重复操作。 |

## Rollback (rollback)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Go back to a prior state when a change causes trouble. | 变更造成问题时返回先前状态。 |
| definition | Rollback restores a previously accepted state after a problematic change where restoration is supported. It does not automatically reverse external effects; irreversible actions may require compensation or human handling. | 回滚在恢复机制支持的情况下，将有问题的变更恢复到先前已接受状态。它不会自动撤销外部影响；不可逆操作可能需要补偿或人工处理。 |
| why_it_matters | A defined reversal path limits damage from failed changes and clarifies what can actually be restored. | 明确的撤销路径可限制失败变更造成的损害，并说明哪些状态确实能恢复。 |
| when_to_use | Use it to restore a prior configuration after a deployment check fails. | 部署检查失败后恢复先前配置时使用。 |
| anti_pattern | Assuming a local file restore also reverses messages or transactions already sent externally. | 假定恢复本地文件也会撤销已经发送的外部消息或事务。 |

## Routing (routing)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Send work to the right model, skill, or agent. | 把工作交给合适的模型、技能或智能体。 |
| definition | Routing directs an incoming request or intermediate work item to a suitable handler based on its characteristics. A route can be chosen by rules or a model; it does not necessarily transfer overall task ownership. | 路由根据请求或中间工作项的特征，将其交给合适处理者。路由可由规则或模型选择，无需一定转移任务的总体责任。 |
| why_it_matters | Matching work to appropriate capabilities improves specialization and avoids running every request through the same expensive process. | 匹配工作与适当能力可改善专门化，并避免所有请求都经过相同的高成本过程。 |
| when_to_use | Use it to send a billing question and a technical incident to different supported workflows. | 将账单问题和技术事件交给不同的受支持工作流时使用。 |
| anti_pattern | Dispatching by a single keyword without checking the request's actual intent. | 未检查请求的实际意图，仅根据一个关键词派发。 |

## Shared State (shared-state)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Let multiple agents use the same trusted state. | 让多个智能体使用同一份可信状态。 |
| definition | Shared state is a common representation that multiple actors can read or update under defined rules. Consistency, versioning, and ownership determine whether it is trustworthy; shared access alone does not prevent conflicts. | 共享状态是多个主体按明确规则读取或更新的共同表示。一致性、版本和责任归属决定其可信程度；共享访问本身无法防止冲突。 |
| why_it_matters | A common progress record helps workers coordinate without independently inventing incompatible accounts of what is complete. | 共同进度记录帮助工作者协调，避免各自对完成情况形成相互冲突的判断。 |
| when_to_use | Use it to track task assignments and accepted results in a system with multiple workers. | 在多工作者系统中跟踪任务分配和已接受结果时使用。 |
| anti_pattern | Allowing agents to overwrite the same status record without conflict detection or ownership rules. | 允许智能体覆盖相同状态记录，却未提供冲突检测或责任规则。 |

## State (state)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Keep track of where the work is right now. | 记录工作当前所处的位置。 |
| definition | State is the explicit representation of a process at a point in time, such as its phase, completed steps, pending actions, and relevant values. It describes progress; a conversation or action history may only indirectly encode it. | 状态是某一时点过程的明确表示，例如阶段、已完成步骤、待执行操作和相关值。它描述进度；对话或操作历史可能仅间接编码这些内容。 |
| why_it_matters | Reliable continuation needs a shared answer about what has happened and what remains to be done. | 可靠续接需要对已发生事项和待完成事项形成共同判断。 |
| when_to_use | Use it to distinguish a queued action from a running, failed, or completed action. | 区分排队、运行、失败或完成的操作时使用。 |
| anti_pattern | Inferring completion solely from the agent saying that it intends to perform an action. | 仅因智能体表示准备执行某项操作，就推断操作已完成。 |

## Subtask (subtask)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Break a big task into smaller pieces of work. | 将较大任务划分成更小工作单元。 |
| definition | A subtask is a smaller work unit that contributes to a parent task. Its inputs, output, and dependencies should be clear enough to integrate its result; local completion does not imply the parent task is finished. | 子任务是对父任务有贡献的较小工作单元。其输入、输出和依赖应足够明确，以便集成结果；局部完成不意味着父任务完成。 |
| why_it_matters | Smaller units make complex work easier to schedule and verify while exposing dependencies that prevent unsafe parallel execution. | 更小单元让复杂工作更容易安排和验证，同时揭示哪些依赖会阻止安全并行。 |
| when_to_use | Use it to separate document extraction from synthesis when the synthesis depends on extracted findings. | 综合结果依赖提取发现时，将文档提取与综合分开使用。 |
| anti_pattern | Marking the parent complete merely because every worker submitted something. | 仅因每个工作者都提交了内容，就将父任务标记完成。 |

## Task Decomposition (task-decomposition)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Break a hard problem into simpler problems. | 将难题划分为更简单的问题。 |
| definition | Task decomposition identifies smaller problems whose results can be combined to satisfy a larger task. It includes defining boundaries and dependencies, not merely splitting the request into similarly sized fragments. | 任务分解识别能够通过组合结果来满足较大任务的更小问题。它包括定义边界和依赖，范围超出按相似大小拆分请求。 |
| why_it_matters | Useful boundaries reduce cognitive load and make it possible to delegate independent work without losing responsibility for integration. | 有效边界减少认知负担，使独立工作可被委派，同时保留集成责任。 |
| when_to_use | Use it to divide a feature into data changes, implementation, and behavioral verification. | 将功能划分成数据变更、实现和行为验证时使用。 |
| anti_pattern | Splitting tightly coupled edits across workers without specifying interfaces or integration ownership. | 把紧密耦合的编辑分给多个工作者，却未规定接口或集成责任。 |

## Task (task)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Give the agent a clear piece of work to finish. | 提供智能体一个明确且可完成的工作单元。 |
| definition | A task is a bounded unit of work with an objective, inputs, constraints, and completion criteria. It may serve a larger goal and may contain subtasks, but should still have an identifiable owner and result. | 任务是具有目标、输入、约束和完成标准的有界工作单元。它可以服务于更大目标，也可以包含子任务，但仍应具有可识别的负责人和结果。 |
| why_it_matters | Bounded work is easier to assign, verify, and recover than an open-ended instruction with no observable finish. | 有界工作比没有可观察终点的开放指令更容易分配、验证和恢复。 |
| when_to_use | Use it to ask an agent to fix a reproducible bug and demonstrate the required behavior. | 要求智能体修复可复现问题，并证明所需行为时使用。 |
| anti_pattern | Assigning a broad role without identifying a deliverable or a condition for completion. | 分配宽泛角色，却未明确产物或完成条件。 |

## Termination (termination)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Know when the job is complete or execution must stop. | 明确工作何时完成，以及执行何时必须停止。 |
| definition | Termination ends execution when a completion, failure, cancellation, or resource condition is reached. The final status should distinguish successful completion from stopping without success and preserve useful results or recovery information. | 终止在满足完成、失败、取消或资源条件时结束执行。最终状态应区分成功完成和未成功停止，并保留有用结果或恢复信息。 |
| why_it_matters | A reliable stopping rule prevents endless loops and keeps an interrupted run from being misreported as a finished task. | 可靠停止规则可防止无限循环，并避免将中断运行误报为已完成任务。 |
| when_to_use | Use it when acceptance checks pass, a budget is exhausted, or an authorized cancellation arrives. | 验收检查通过、预算耗尽或收到已授权取消请求时使用。 |
| anti_pattern | Marking a task complete solely because the agent stopped making progress. | 仅因智能体不再取得进展，就把任务标记完成。 |

## Thin Kernel (thin-kernel)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | A minimal deterministic core that owns essential execution guarantees while leaving fast-changing judgment to replaceable agent policies. | 负责必要执行保证的最小确定性核心，将快速变化的判断交给可替换的智能体策略。 |
| definition | A thin kernel keeps only durable mechanisms—such as permissions, state transitions, tool invocation, audit recording, and cancellation—in trusted code. Planning strategies, prompts, and domain heuristics remain outside the kernel so they can evolve without weakening core guarantees. | 薄内核仅在可信代码中保留权限、状态转换、工具调用、审计记录和取消等长期机制。规划策略、提示和领域启发式方法留在内核之外，使其可演进而不削弱核心保证。 |
| why_it_matters | AI behavior changes quickly while authorization and execution invariants should remain stable. A small trusted core is easier to test, audit, and port. | AI 行为快速变化，但授权与执行不变量应保持稳定。小型可信核心更容易测试、审计和迁移。 |
| when_to_use | Use it when building an agent runtime, orchestration platform, or safety-sensitive tool layer. | 构建智能体运行时、编排平台或具有安全要求的工具层时使用。 |
| anti_pattern | Embedding every workflow rule in the runtime until policy changes require risky kernel modifications. | 将所有工作流规则嵌入运行时，导致策略变更需要有风险的内核修改。 |

## Workflow (workflow)

| Unit | Canonical English | Chinese draft |
| --- | --- | --- |
| summary | Follow a known path when steps are predictable. | 步骤可预测时遵循已知路径。 |
| definition | A workflow defines an established sequence or graph of steps, including branches and failure paths. It can contain model calls, but its overall control flow is prescribed rather than decided afresh by an agent at every turn. | 工作流定义既定步骤顺序或图，包括分支和失败路径。它可以包含模型调用，但总体控制流预先规定，无需智能体每轮重新决定。 |
| why_it_matters | Predictable processes are easier to inspect and test when their transitions are explicit and repeated consistently. | 过程转换明确且一致重复时，可预测过程更容易检查和测试。 |
| when_to_use | Use it for a document pipeline with extraction, validation, and publication stages. | 用于包含提取、验证和发布阶段的文档流水线。 |
| anti_pattern | Using an unconstrained agent to rediscover the same mandatory sequence on every run. | 用不受约束的智能体在每次运行中重新发现相同的必需步骤。 |
