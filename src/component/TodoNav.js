function TodoNav({ nickname, handleLogOut }) {
  return (
    <nav>
      <h1>
        <a href="">ONLINE TODO LIST</a>
      </h1>
      <ul>
        <li className="todo_sm">
          <a href="">
            <span>{nickname} 的代辦</span>
          </a>
        </li>
        <li>
          <a href="" onClick={(e) => handleLogOut(e)}>
            登出
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default TodoNav;
