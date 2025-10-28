import {
  Send,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  TrendingUp,
  Clock,
} from "lucide-react";
import type { Contacts } from "../types/contactType";

export const menuItems = [
  { id: "dashboard", label: "Dashboard", path: '/dashboard', icon: BarChart3 },
  { id: "sms", label: "Envoyer SMS", path: '/send-sms', icon: Send },
  { id: "contacts", label: "Contacts", path: '/contact', icon: Users },
  { id: "historique", label: "Historique", path: '/history', icon: Clock },
  { id: "services", label: "Services", path: '/service', icon: MessageSquare },
  { id: "settings", label: "Paramètres", path: '/parametre', icon: Settings },
];

export const stats = [
  {
    label: "SMS Envoyés",
    value: "12,458",
    change: "+12%",
    icon: Send,
    color: "bg-blue-500",
  },
  {
    label: "Contacts Actifs",
    value: "3,847",
    change: "+8%",
    icon: Users,
    color: "bg-green-500",
  },
  {
    label: "Taux de Réussite",
    value: "98.5%",
    change: "+2%",
    icon: TrendingUp,
    color: "bg-purple-500",
  },
  {
    label: "SMS Planifiés",
    value: "24",
    change: "-5%",
    icon: Clock,
    color: "bg-orange-500",
  },
];

export const recentActivity = [
  {
    action: "Campagne Marketing",
    status: "Terminé",
    count: "500 SMS",
    time: "Il y a 2h",
  },
  {
    action: "Notification Client",
    status: "En cours",
    count: "150 SMS",
    time: "Il y a 30min",
  },
  {
    action: "Rappel Événement",
    status: "Planifié",
    count: "300 SMS",
    time: "Dans 3h",
  },
];

export const contacts =[
    { id: 1, nom: 'Jean Dupont', telephone: '+261340000001', groupe: 'Clients', date: '2025-10-15' },
    { id: 2, nom: 'Marie Martin', telephone: '+261340000002', groupe: 'Partenaires', date: '2025-10-14' },
    { id: 3, nom: 'Pierre Rakoto', telephone: '+261340000003', groupe: 'Clients', date: '2025-10-13' },
    { id: 4, nom: 'Sophie Randria', telephone: '+261340000004', groupe: 'Équipe', date: '2025-10-12' },
    { id: 5, nom: 'Luc Razaf', telephone: '+261340000005', groupe: 'Clients', date: '2025-10-11' },
  ];

export const smsData = [
    { mois: 'Jan', envoyes: 4000, reussis: 3800, echecs: 200 },
    { mois: 'Fev', envoyes: 3000, reussis: 2900, echecs: 100 },
    { mois: 'Mar', envoyes: 5000, reussis: 4850, echecs: 150 },
    { mois: 'Avr', envoyes: 4500, reussis: 4400, echecs: 100 },
    { mois: 'Mai', envoyes: 6000, reussis: 5900, echecs: 100 },
    { mois: 'Juin', envoyes: 5500, reussis: 5400, echecs: 100 },
  ];

export const distributionData = [
    { name: 'Envoyés', value: 5400, color: '#3b82f6' },
    { name: 'Échecs', value: 100, color: '#ef4444' },
    { name: 'En attente', value: 50, color: '#f59e0b' },
  ];

export const tauxReussiteData = [
    { jour: 'Lun', taux: 98 },
    { jour: 'Mar', taux: 97 },
    { jour: 'Mer', taux: 99 },
    { jour: 'Jeu', taux: 98 },
    { jour: 'Ven', taux: 97 },
    { jour: 'Sam', taux: 99 },
    { jour: 'Dim', taux: 98 },
  ];

export const notifs = [
    { id: 'Jan', title: "notif1", message: "mon message", time: "time", type: "nofits" },
  ]

export const historiqueData = [
  { 
      id: 1, 
      expediteur: 'ZeroNotify', 
      destinataires: ['+261340000001', '+261340000002', '+261340000003'],
      contenu: 'Bienvenue chez ZeroNotify ! Profitez de notre service SMS premium.',
      statut: 'envoye',
      type: 'groupe',
      total: 3,
      envoyes: 3,
      echecs: 0,
      dateEnvoi: '2025-10-20 14:30:00',
      datePlanifiee: null
    },
    { 
      id: 2, 
      expediteur: 'Marketing', 
      destinataires: ['+261340000001'],
      contenu: 'Nouvelle offre : -20% sur tous nos services !',
      statut: 'envoye',
      type: 'simple',
      total: 1,
      envoyes: 1,
      echecs: 0,
      dateEnvoi: '2025-10-20 12:15:00',
      datePlanifiee: null
    },
    { 
      id: 3, 
      expediteur: 'Support', 
      destinataires: ['+261340000005', '+261340000006'],
      contenu: 'Votre demande a été traitée avec succès.',
      statut: 'echec',
      type: 'groupe',
      total: 2,
      envoyes: 0,
      echecs: 2,
      dateEnvoi: '2025-10-20 10:45:00',
      datePlanifiee: null
    },
    { 
      id: 4, 
      expediteur: 'ZeroNotify', 
      destinataires: ['+261340000001', '+261340000002', '+261340000003', '+261340000004'],
      contenu: 'Rappel : Réunion demain à 10h. Merci de confirmer votre présence.',
      statut: 'planifie',
      type: 'planifie',
      total: 4,
      envoyes: 0,
      echecs: 0,
      dateEnvoi: null,
      datePlanifiee: '2025-10-21 09:00:00'
    },
    { 
      id: 5, 
      expediteur: 'Notifications', 
      destinataires: ['+261340000001', '+261340000002'],
      contenu: 'Votre commande #12345 a été expédiée.',
      statut: 'envoye',
      type: 'groupe',
      total: 2,
      envoyes: 1,
      echecs: 1,
      dateEnvoi: '2025-10-19 16:20:00',
      datePlanifiee: null
    },
]

export const ContactData: Contacts[] = [
    {
      id: 1,
      nom: "Jean Dupont",
      telephone: "+261340000001",
      groupe: "Clients",
      updatedAt: "2025-10-15",
    },
    {
      id: 2,
      nom: "Marie Martin",
      telephone: "+261340000002",
      groupe: "Partenaires",
      updatedAt: "2025-10-14",
    },
    {
      id: 3,
      nom: "Pierre Rakoto",
      telephone: "+261340000003",
      groupe: "Clients",
      updatedAt: "2025-10-13",
    },
    {
      id: 4,
      nom: "Sophie Randria",
      telephone: "+261340000004",
      groupe: "Équipe",
      updatedAt: "2025-10-12",
    },
    {
      id: 5,
      nom: "Luc Razaf",
      telephone: "+261340000005",
      groupe: "Clients",
      updatedAt: "2025-10-11",
    },
  ]