import React, { useState } from 'react';
import { Send, Zap, Clock, Users, TrendingUp, CheckCircle, Star, ArrowRight, Shield, BarChart, Smartphone, Globe } from 'lucide-react';
import Layout from './Layout';
import { Header } from '../components/Header';

const Services = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      priceMonthly: '25,000',
      priceYearly: '250,000',
      sms: '500',
      icon: Send,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Jusqu\'à 500 SMS/mois',
        'SMS simple et groupé',
        'Support email',
        'Rapport mensuel',
        'API basique'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      priceMonthly: '75,000',
      priceYearly: '750,000',
      sms: '2,000',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Jusqu\'à 2,000 SMS/mois',
        'SMS planifiés',
        'Templates personnalisés',
        'Support prioritaire 24/7',
        'API avancée',
        'Statistiques détaillées',
        'Webhook'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      priceMonthly: '150,000',
      priceYearly: '1,500,000',
      sms: 'Illimité',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      features: [
        'SMS illimités',
        'Toutes les fonctionnalités Pro',
        'Compte manager dédié',
        'SLA garanti 99.9%',
        'Intégration personnalisée',
        'Formation équipe',
        'White label'
      ],
      popular: false
    }
  ];

  const services = [
    {
      icon: Send,
      title: 'Envoi de SMS en masse',
      description: 'Envoyez jusqu\'à 10,000 SMS en une seule campagne',
      color: 'bg-blue-500'
    },
    {
      icon: Clock,
      title: 'SMS planifiés',
      description: 'Programmez vos envois à l\'avance pour plus d\'efficacité',
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      title: 'Gestion de contacts',
      description: 'Organisez vos contacts en groupes intelligents',
      color: 'bg-green-500'
    },
    {
      icon: BarChart,
      title: 'Rapports détaillés',
      description: 'Analyses en temps réel de vos campagnes SMS',
      color: 'bg-orange-500'
    },
    {
      icon: Shield,
      title: 'Sécurité garantie',
      description: 'Vos données sont cryptées et protégées',
      color: 'bg-red-500'
    },
    {
      icon: Globe,
      title: 'Couverture nationale',
      description: 'Tous les opérateurs de Madagascar couverts',
      color: 'bg-indigo-500'
    }
  ];

  const features = [
    {
      title: 'API Puissante',
      description: 'Intégrez facilement notre service dans vos applications',
      icon: Smartphone
    },
    {
      title: 'Support 24/7',
      description: 'Notre équipe est disponible pour vous aider à tout moment',
      icon: Users
    },
    {
      title: 'Taux de livraison élevé',
      description: '98.5% de taux de succès sur tous les envois',
      icon: TrendingUp
    }
  ];

  const testimonials = [
    {
      name: 'Jean Rakoto',
      company: 'E-Commerce MG',
      text: 'ZeroNotify a transformé notre communication client. Service excellent !',
      rating: 5,
      avatar: 'JR'
    },
    {
      name: 'Marie Andria',
      company: 'Restaurant Le Parc',
      text: 'Les SMS planifiés nous font gagner un temps précieux. Très satisfaits.',
      rating: 5,
      avatar: 'MA'
    },
    {
      name: 'Pierre Rabe',
      company: 'Clinique Santé+',
      text: 'Fiable et rapide. Parfait pour nos rappels de rendez-vous.',
      rating: 5,
      avatar: 'PR'
    }
  ];

  return (
    <Layout>
      <Header />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Nos Services & Tarifs</h1>
          <p className="text-xl text-white/90 mb-8">
            Choisissez le plan qui correspond à vos besoins
          </p>
          
          {/* Toggle Billing */}
          <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Annuel
              <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                -17%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-8 -mt-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
            
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:-translate-y-2 ${
                  plan.popular ? 'ring-4 ring-purple-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 font-semibold">
                    ⭐ Le plus populaire
                  </div>
                )}
                
                <div className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-slate-900">{price}</span>
                    <span className="text-slate-500 ml-2">Ar/{billingCycle === 'monthly' ? 'mois' : 'an'}</span>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-lg font-semibold text-slate-700 mb-4">
                      {plan.sms} SMS/mois
                    </p>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    Choisir ce plan
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-8 mb-20">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          Fonctionnalités incluses
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20 px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Pourquoi choisir ZeroNotify ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-8 mb-20">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          Ce que disent nos clients
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.company}</p>
                </div>
              </div>
              
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-slate-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à démarrer ?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Rejoignez plus de 500 entreprises qui font confiance à ZeroNotify
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:shadow-2xl transition-all transform hover:-translate-y-1">
              Commencer gratuitement
            </button>
            <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all">
              Contacter le support
            </button>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Services;