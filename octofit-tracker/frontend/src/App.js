import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Activities from './components/Activities';
import Teams from './components/Teams';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src="/logo.png" alt="OctoFit Logo" className="navbar-logo" />
              🏋️ OctoFit Tracker
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">Activities</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">Teams</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">Workouts</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="text-center">
      <h1 className="display-4 mb-3 fw-bold">Bem-vindo ao OctoFit Tracker 💪</h1>
      <p className="lead mb-5">Seu companheiro completo para acompanhamento de fitness</p>
      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="display-1 mb-3">👥</div>
              <h5 className="card-title">Usuários</h5>
              <p className="card-text flex-grow-1">Gerencie e visualize todos os entusiastas de fitness</p>
              <Link to="/users" className="btn btn-primary mt-3">Ver Usuários</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="display-1 mb-3">🏃</div>
              <h5 className="card-title">Atividades</h5>
              <p className="card-text flex-grow-1">Registre e monitore suas atividades físicas</p>
              <Link to="/activities" className="btn btn-success mt-3">Ver Atividades</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="display-1 mb-3">🏆</div>
              <h5 className="card-title">Ranking</h5>
              <p className="card-text flex-grow-1">Veja os melhores desempenhos e compete</p>
              <Link to="/leaderboard" className="btn btn-warning mt-3">Ver Ranking</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="display-1 mb-3">👫</div>
              <h5 className="card-title">Equipes</h5>
              <p className="card-text flex-grow-1">Crie e participe de equipes para desafios em grupo</p>
              <Link to="/teams" className="btn btn-info mt-3">Ver Equipes</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="display-1 mb-3">💪</div>
              <h5 className="card-title">Treinos</h5>
              <p className="card-text flex-grow-1">Receba sugestões personalizadas de treinos</p>
              <Link to="/workouts" className="btn btn-danger mt-3">Ver Treinos</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
