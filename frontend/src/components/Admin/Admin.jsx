import './Admin.css';

function Admin() {
  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-icon">
          <i className="fas fa-chart-line"></i>
        </div>
        <h1>Espace Admin</h1>
        <iframe title="i wanna die" width="1024" height="612" src="https://app.powerbi.com/view?r=eyJrIjoiNzBhNWJjMjktZTg2OC00ZDkwLThkODEtODVhZjNhYTYyYzhhIiwidCI6ImI3YmQ0NzE1LTQyMTctNDhjNy05MTllLTJlYTk3ZjU5MmZhNyJ9" frameborder="0" allowFullScreen="true"></iframe>
      </div>
    </div>
  );
}

export default Admin;
