import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, Play, Users, Award, Clock, Zap, Heart, Activity, Dumbbell, Bike } from 'lucide-react';
import styles from '../assets/css/landing.module.css';
import logo from '../assets/img/logo.png';

const Landing = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const services = [
    {
      icon: <Users className={styles['service-icon']} />,
      title: "Personal Training",
      description: "Create personalized workout plans tailored to your fitness level and goals with flexible customization."
    },
    {
      icon: <Award className={styles['service-icon']} />,
      title: "Progress Tracking",
      description: "Monitor your fitness journey with detailed analytics, achievements, and milestone celebrations."
    },
    {
      icon: <Clock className={styles['service-icon']} />,
      title: "Flexible Scheduling",
      description: "Work out on your own time with customizable workout schedules that fit your busy lifestyle."
    },
    {
      icon: <Zap className={styles['service-icon']} />,
      title: "Quick Workouts",
      description: "Access efficient 15-30 minute workouts perfect for busy schedules and maximum results."
    }
  ];

  const exercises = [
    {
      icon: <Activity className={styles['exercise-icon']} />,
      title: "Weight Loss",
      description: "Burn calories effectively with high-intensity workouts designed to maximize fat loss and boost metabolism.",
      color: "#ff6b6b"
    },
    {
      icon: <Dumbbell className={styles['exercise-icon']} />,
      title: "Muscle Gain",
      description: "Build lean muscle mass with progressive strength training programs and proper nutrition guidance.",
      color: "#4ecdc4"
    },
    {
      icon: <Heart className={styles['exercise-icon']} />,
      title: "Cardiovascular Health",
      description: "Improve heart health and endurance with cardio workouts that strengthen your cardiovascular system.",
      color: "#45b7d1"
    }
  ];

  const faqs = [
    {
      question: "How does Fitrack create personalized workout plans?",
      answer: "Fitrack lets you customize your workout plans based on your fitness level, goals, available time, and preferences, so you get the perfect routine for you."
    },
    {
      question: "Can I use Fitrack without gym equipment?",
      answer: "Absolutely! Fitrack offers a wide variety of bodyweight exercises and home workouts that require no equipment. You can also filter workouts based on available equipment."
    },
    {
      question: "How often should I work out with Fitrack?",
      answer: "The frequency depends on your fitness goals and current level. Fitrack typically recommends 3-5 workout sessions per week, with rest days incorporated for optimal recovery."
    },
    {
      question: "Is Fitrack suitable for beginners?",
      answer: "Yes! Fitrack is designed for all fitness levels. You can start with beginner-friendly exercises and gradually increase intensity as you build strength and confidence."
    },
    {
      question: "Can I track my nutrition with Fitrack?",
      answer: "While Fitrack focuses primarily on workouts, it provides basic nutrition guidance and meal suggestions that complement your fitness goals and workout routine."
    }
  ];

  return (
    <div className={styles['landing-container']}>
      {/* Header */}
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles['nav-brand']}>
            <img className={styles.logo} src={logo} alt="Fitrack Logo" />
            <span className={styles['brand-name']}>Fitrack</span>
          </div>
          <div className={styles['nav-links-full']}>
            <div className={styles['nav-links-left']}>
              <a href="#services">Services</a>
              <a href="#exercises">Programs</a>
              <a href="#faq">FAQ</a>
            </div>

            <div className={styles['nav-links-auth']}>
              <button className={styles['cta-button']} onClick={() => navigate('/register')}>
                Register
              </button>
              <button
                className={styles['cta-button']}
                onClick={() => navigate('/login')}
                style={{ marginLeft: '10px' }}
              >
                Login
              </button>
            </div>
          </div>
        </nav>

        <div className={styles['hero-section']}>
          <div className={styles['hero-content']}>
            <h1 className={styles['hero-title']}>
              Transform Your Body,<br />
              <span className={styles['gradient-text']}>Transform Your Life</span>
            </h1>
            <p className={styles['hero-description']}>
              Discover the power of personalized fitness with Fitrack. Customize your workouts, 
              track your progress, and schedule your training, all in one easy-to-use app.
            </p>
            <div className={styles['hero-buttons']}>
              <button className={styles['primary-button']} onClick={() => navigate('/register')}>
                <Play className={styles['button-icon']} />
                Start Your Journey
              </button>
            </div>
          </div>
          <div className={styles['hero-visual']}>
            <div className={styles['hero-phone']}>
              <div className={styles['phone-screen']}>
                <div className={styles['app-preview']}>
                  <div className={styles['preview-header']}>
                    <div className={styles['preview-avatar']}></div>
                    <div className={styles['preview-greeting']}>
                      <h4>Good Morning!</h4>
                      <p>Ready for today's workout?</p>
                    </div>
                  </div>
                  <div className={styles['preview-stats']}>
                    <div className={styles['preview-stat']}>
                      <span>7</span>
                      <small>Day Streak</small>
                    </div>
                    <div className={styles['preview-stat']}>
                      <span>240</span>
                      <small>Calories</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className={styles['services-section']}>
        <div className={styles.container}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>Why Choose Fitrack?</h2>
            <p className={styles['section-subtitle']}>
              Everything you need to achieve your fitness goals in one powerful platform
            </p>
          </div>
          <div className={styles['services-grid']}>
            {services.map((service, index) => (
              <div key={index} className={styles['service-card']}>
                <div className={styles['service-icon-wrapper']}>
                  {service.icon}
                </div>
                <h3 className={styles['service-title']}>{service.title}</h3>
                <p className={styles['service-description']}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exercises Section */}
      <section id="exercises" className={styles['exercises-section']}>
        <div className={styles.container}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>Fitness Programs</h2>
            <p className={styles['section-subtitle']}>
              Specialized workout programs designed to help you reach your specific fitness goals
            </p>
          </div>
          <div className={styles['exercises-grid']}>
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className={styles['exercise-card']}
                style={{ '--accent-color': exercise.color }}
              >
                <div className={styles['exercise-icon-wrapper']}>
                  {exercise.icon}
                </div>
                <h3 className={styles['exercise-title']}>{exercise.title}</h3>
                <p className={styles['exercise-description']}>{exercise.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={styles['faq-section']}>
        <div className={styles.container}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>Frequently Asked Questions</h2>
            <p className={styles['section-subtitle']}>
              Got questions? We've got answers to help you get started with confidence
            </p>
          </div>
          <div className={styles['faq-container']}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`${styles['faq-item']} ${openFaq === index ? styles.active : ''}`}
              >
                <button
                  className={styles['faq-question']}
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`${styles['faq-icon']} ${openFaq === index ? styles.rotated : ''}`}
                  />
                </button>
                <div className={styles['faq-answer']}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles['footer-content']}>
            <div className={styles['footer-brand']}>
              <div className={styles['footer-logo']}>
                <img src={logo} alt="Fitrack Logo" />
                <span>Fitrack</span>
              </div>
              <p className={styles['footer-description']}>
                Transform your fitness journey with customizable workouts and personalized training programs.
              </p>
            </div>
            <div className={styles['footer-links']}>
              <div className={styles['footer-column']}>
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">Download</a>
                <a href="#">Updates</a>
              </div>
              <div className={styles['footer-column']}>
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Contact Us</a>
                <a href="#">Community</a>
                <a href="#">Feedback</a>
              </div>
              <div className={styles['footer-column']}>
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Careers</a>
                <a href="#">Blog</a>
                <a href="#">Press</a>
              </div>
            </div>
          </div>
          <div className={styles['footer-bottom']}>
            <p>&copy; 2025 Fitrack. All rights reserved.</p>
            <div className={styles['footer-bottom-links']}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;