import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
// Assurez-vous d'avoir une instance Axios configurée
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeClosed } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ nom: '', email: '', mot_de_passe: '', entreprise: '' });
  const [isvisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isvisible);
  };
  
  const setLoading = useAuthStore((state) => state.setLoading);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Endpoint d'inscription à adapter
      await api.post('/auth/signup', formData); 
      toast.success('Inscription réussie ! Veuillez vous connecter.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de l\'inscription.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-screen w-full flex items-center justify-center'>
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-5 text-center">Inscription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="border border-gray-300 rounded-lg flex items-center px-3 focus-within:ring-2 focus-within:ring-black-500">
            <input
            type={isvisible ? "text" : "password"}
            name="mot_de_passe"
            placeholder="Mot de passe"
            onChange={handleChange}
            required
            className="w-full p-3 border-none focus:ring-0 outline-none ml-[-12px]"
            />
            {isvisible ? <Eye onClick={toggleVisibility} className='cursor-pointer'/> : <EyeClosed onClick={toggleVisibility} className='cursor-pointer'/>}
            
        </div>
        <input
          type="text"
          name="entreprise"
          placeholder="Entreprise"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-lg transition duration-200"
        >
          S'inscrire
        </button>
        <p className="mt-4 text-center text-[13px]">Déjà un compte ? <a href="/login" className="text-blue-500 hover:underline">Connectez-vous</a></p>
      </form>
    </div>
    </div>
  );
};

export default Register;