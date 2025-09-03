Thank you again for the productive conversation. I've spent considerable time analysing your questions about audit trails and complex data logic, and it's solidified my recommendation to use NestJS as our primary backend framework.
Below, I’ve addressed your specific points in detail.
1. Audit Trails, Logging, and Regulatory Compliance
You are correct that Django has built-in authentication and admin modules. However, for enterprise-grade, custom audit trails that meet strict regulatory standards, NestJS provides a more powerful and flexible foundation.
Not Building from Scratch: We wouldn't be building this ourselves. We would use the NestJS ecosystem to integrate battle-tested solutions.
Seamless Authentication: We can integrate Passport.js with a wide variety of strategies (JWT, OAuth2, SAML) for robust user management and authentication, giving us flexibility for future SSO requirements.
Automated Audit Logging: Using an ORM like TypeORM or MikroORM, we can implement elegant, non-intrusive audit logging through:
Entity Subscribers: These can automatically listen to create, update, and delete events on any entity. Every change can be written to an audit log table with the user ID, timestamp, old values, and new values, without cluttering the core business logic.
Advanced ORM Features: Features like @CreateDateColumn, @UpdateDateColumn, and @VersionColumn provide built-in change-tracking at the entity level.
This approach is actually superior for compliance because it gives us fine-grained control over exactly what is logged and how, ensuring we meet the specific mandates of the Australian Energy industry without being boxed in by a framework's default behaviour.
2. Handling Extreme Query Complexity
The example you provided (NTC Combination -> Retail Tariff -> Plan -> Rate Card, etc.) is an excellent test case. This is precisely where NestJS shines.
Full-Range Query Capability: We are not limited to a single ORM. We can choose the right tool for each job:
Standard ORM (TypeORM): For most CRUD operations and simpler joins.
Query Builder: For complex, dynamic multi-table joins where we need more control than the ORM provides.
Raw SQL Queries: For ultimate performance in the most critical and complex pathways (like your example). We can write highly optimized PostgreSQL queries and still easily map the results to structured objects.
Performance-Centric Architecture: NestJS's async/await foundation ensures these complex, data-heavy operations won't block the event loop, maintaining responsiveness for other users and integrations.
Superior Analytics Integration: This architecture dovetails perfectly with Grafana and Looker. We can build dedicated endpoints that perform these complex queries and format the data perfectly for visualization and dashboards, providing immense business value.

3. Hybrid Approach (Django + NestJS)
While your idea of using Django for the core data model and NestJS for the transformation layer is interesting, it would introduce unnecessary complexity:
Maintenance Overhead: Maintaining two frameworks, two deployment pipelines, and inter-service communication would add significant overhead.
Consistency: Using a single framework (NestJS) ensures consistency in codebase, development patterns, and tooling across the entire application.
Performance: NestJS’s non-blocking, asynchronous architecture is better suited for handling high-throughput scenarios, such as integrating with multiple third-party systems.
