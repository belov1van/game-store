import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer /Footer";
import "./AboutUs.css";

const AboutUs: React.FC = () => {
  const teamMember = [
    {
      name: "Belov Ivan",
      role: "Frontend",
      github: "https://github.com/belov1van",
      githubUsername: "belov1van"
    },
  ];

  const features = [
    {
      title: "Curated Selection",
      description: "Hand-picked games from indie developers to AAA titles",
    },
    {
      title: "Secure Payments",
      description: "Safe and secure payment processing for all purchases",
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your needs",
    },
    {
      title: "Instant Delivery",
      description: "Get your games immediately after purchase",
    },
  ];

  const handleSearch = (term: string) => {
    console.log("Searching for:", term);
  };

  return (
    <div className="about-container">
      <Header onSearch={handleSearch} />

      <main className="about-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">about us</h1>
            <p className="hero-description">
              We're passionate about connecting gamers with their next favorite
              adventure. Gamestore is more than just a store - it's a community
              of gamers, for gamers.
            </p>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">why choose us</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="team-section">
          <h2 className="section-title">developer</h2>
          <div className="team-grid">
            {teamMember.map((member, index) => (
              <a
                key={index}
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card-link"
              >
                <div className="team-card">
                  <h3 className="team-name">{member.name}</h3>
                  <div className="team-role">{member.role}</div>
                  <div className="team-github">
                    <span>{member.githubUsername}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;