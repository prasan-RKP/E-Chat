import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';

const LoginTrae  = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-base-200"
    >
      <div className="card w-96 bg-base-100 shadow-xl">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="card-body"
        >
          <h2 className="card-title text-2xl font-bold text-center mb-6">Welcome Back!</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="input-group">
                <span className="bg-base-300 px-4 flex items-center">
                  <Mail size={20} />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className="input input-bordered w-full"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="input-group">
                <span className="bg-base-300 px-4 flex items-center">
                  <Lock size={20} />
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary w-full mt-6 flex items-center justify-center gap-2"
              type="submit"
            >
              <LogIn size={20} />
              Sign In
            </motion.button>
          </form>

          <div className="divider">OR</div>

          <p className="text-center">
            Don't have an account?{' '}
            <a href="#" className="link link-primary">
              Sign up
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginTrae;