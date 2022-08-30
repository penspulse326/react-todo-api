import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TodoNav from '../component/TodoNav';
import TodoAdd from '../component/TodoAdd';
import List from '../component/List';

function TodoPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const { token, setToken, localUser } = useAuth();

  const getList = async () => {
    return await fetch('https://todoo.5xcamp.us/todos', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        authorization: token || localUser.auth,
      }),
    })
      .then((res) => res.json())
      .then((result) => setList(result.todos))
      .catch((err) => console.log(err.toString()));
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    setToken(null);
    window.localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    if (!token && !localUser) {
      navigate('../');
    } else {
      getList();
    }
  }, [list]);

  return (
    <div id="todoListPage" className="bg-half">
      <TodoNav nickname={localUser?.nickname} handleLogOut={handleLogOut} />
      <div className="conatiner todoListPage vhContainer">
        <div className="todoList_Content">
          <TodoAdd getList={getList} />
          <List list={list} getList={getList} />
        </div>
      </div>
    </div>
  );
}

export default TodoPage;