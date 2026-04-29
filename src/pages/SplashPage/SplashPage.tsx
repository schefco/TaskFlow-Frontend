import { useNavigate } from "react-router-dom";
import "./SplashPage.css";

export default function SplashPage() {
    // Landing page for after the user can login
    // Welcome/Home page
    // Explains TaskFlow and tech stack

    const navigate = useNavigate();

    return (
        <div className="splash-container">
            <section className="hero">
                <h1 className="hero-title">TaskFlow</h1>

                <p className="hero-subtitle">A clean, modern project and task management platform designed for clarity, speed, and simplicity.</p>
            </section>

            {/**Feature section */}
            {/**Highlight features of TaskFlow */}
            <section className="features">
                <h2 className="section-title">What You Can Do</h2>

                <div className="feature-grid">
                    <FeatureCard title="Organize Projects"
                    description="Create structured projects with clear ownership, timelines, and priorities." />

                    <FeatureCard title="Track Tasks"
                    description="Manage tasks, subtasks, and progress with a simple, intuitive workflow." />

                    <FeatureCard title="Collaborate Easily"
                    description="Comment directly on tasks to keep communication focused and actionable."  />
                </div>
            </section>

            {/**Why TaskFlow section */}
            {/**Covers technical and architectural strengths */}
            <section className="why">
                <h2 className="section-title">Why TaskFlow?</h2>

                <div className="why-grid">
                    <ValueCard title="Fast & Lightweight"
                    text="Built with .NET 8, EF Core, and Vite for high performance." />

                    <ValueCard title="Secure by Design"
                    text="JWT authentication, hashed passwords, and clean architecture." />

                    <ValueCard title="Clean Architecture"
                    text="Separation of concerns across API, Application, Domain, and Infrastructure." />

                    <ValueCard title="Open Source"
                    text="Fully transparent codebase you can explore, learn from, or extend." />
                </div>
            </section>

            {/**GitHub download section */}
            <section className="download">
                <h2 className="section-title">Open Source</h2>

                <p className="download-text">Explore the full TaskFlow codebase on GitHub.</p>

                <div className="download-buttons">
                    <a onClick={() => navigate("https://github.com/schefco/TaskFlow-Frontend")}
                    target="_blank"
                    className="btn-dark">Frontend Repository</a>
                </div>

                <a onClick={() => navigate("https://github.com/schefco/TaskFlow-Backend")}
                target="_blank"
                className="btn-dark">Backend Repository</a>
            </section>

            {/**Footer */}
            <footer className="footer">
                © {new Date().getFullYear()} TaskFlow — Built by Schefco
            </footer>
        </div>
    )
}

/**Features card component */
function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="feature-card">
            <h3 className="feature-title">{title}</h3>
            <p className="feature-desc">{description}</p>
        </div>
    );
}

/**Value card component */
function ValueCard({ title, text }: { title: string, text: string }) {
    return(
        <div className="value-card">
            <h3 className="value-title">{title}</h3>
            <p className="value-text">{text}</p>
        </div>
    );
}