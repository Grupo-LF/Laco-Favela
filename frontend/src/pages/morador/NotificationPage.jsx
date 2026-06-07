// import React, { useState } from 'react';
// import Sidebar from '../../components/layout/Sidebar';
// import '../../styles/pages/morador/NotificationPage.css';
// function ProtoIcon({ size = 33 }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <rect width="32" height="32" fill="black"/>
//       <line x1="0.707107" y1="0.7072" x2="31.7374" y2="31.7375" stroke="white" strokeWidth="2"/>
//     </svg>
//   );
// }

// const initialNotifications = [
//   { id: 1, title: 'Reunião da comunidade', desc: 'Amanhã às 18h no Centro Comunitário - Assunto: Melhorias na praça central e iluminação.', time: 'Hoje, 09:14', read: false },
//   { id: 2, title: 'Status Atualizado', desc: 'Sua situação foi atualizada para Aprovado. Confira os detalhes em Acompanhamento.', time: 'Ontem, 14:32', read: false },
//   { id: 3, title: 'Nova Ação Disponível', desc: 'Uma nova ação da comunidade está disponível para você participar. Acesse Acompanhamento para saber mais.', time: 'Ontem, 11:00', read: false },
//   { id: 4, title: 'Palestra: Direitos do Morador', desc: 'O evento vai ser realizado na praça central às 16h. Contamos com a sua participação!', time: '3 dias atrás', read: true },
//   { id: 5, title: 'Você subiu no Ranking!', desc: 'Parabéns! Você alcançou o Nível 3 de engajamento na comunidade.', time: '1 semana atrás', read: true }
// ];

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState(initialNotifications);

//   const unreadCount = notifications.filter(n => !n.read).length;

//   const markAllAsRead = () => {
//     setNotifications(notifications.map(n => ({ ...n, read: true })));
//   };

//   return (
//     <div className="notifications-page" style={{ display: 'flex' }}>
//       <Sidebar />
//       <div className="notifications-content">
//         <header className="notifications-header">
//           <h1>Notificações</h1>
//           <p>{unreadCount} mensagens não lidas</p>
//           <button className="mark-read-btn" onClick={markAllAsRead}>
//             Marcar todas como lidas
//           </button>
//         </header>
//         <div className="notifications-list">
//           {notifications.map(n => (
//             <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
//               <ProtoIcon size={18} />
//               <div className="notification-body">
//                 <h3>{n.title}</h3>
//                 <p>{n.desc}</p>
//                 <span className="notification-time">{n.time}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }