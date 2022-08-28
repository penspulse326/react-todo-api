import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useRef, useState } from 'react';


const user = JSON.parse(window.localStorage.getItem('user'));
const MySwal = withReactContent(Swal);


function Item({ item, getList }) {
    const { token } = useAuth();
    const stat = useRef(null); 

    const handleItemToggle = async (e) => {
        e.target.setAttribute('disabled', true);
        await fetch(`https://todoo.5xcamp.us/todos/${item.id}/toggle`, {
          method: 'PATCH',
          headers: new Headers({
            'Content-Type': 'application/json',
            'authorization': token || user?.auth,
          })
        })
          .then(res => stat.current = res.status)
          .catch(err => console.log(err.toString()))
          .finally(() => getList());
          
      e.target.removeAttribute('disabled');

      MySwal.fire({
        toast: true,
        position: 'top-end',
        icon: stat.current === 200 ? 'success' : 'error',
        title: `狀態切換${stat.current === 200 ? "成功" : "失敗"}`,
        showConfirmButton: false,
        timer: 1250 
      })
    }


    const handleDelete = (e) => {
      e.preventDefault();
      fetch(`https://todoo.5xcamp.us/todos/${item.id}`, {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          'authorization': token || user?.auth,
        })
      })
        .then(res => res.json())
        .then(result => {
           MySwal.fire({
            position: 'center',
            icon: 'success',
            title: `${result.message}`,
            showConfirmButton: false,
            timer: 1250
          })   
        })
        .catch(err => console.log(err.toString()))
        .finally(() => getList())
    }

    return (
      <li>  
        <label className="todoList_label">
          <input
            className="todoList_input"
            type="checkbox"
            checked={ item.completed_at && "checked"}
            onChange={e => handleItemToggle(e)}
          />
          <span>{item.content}</span>
        </label>
        <a href="#" onClick={handleDelete}>
          <i className="fa fa-times" />
        </a>
      </li>
    )
}

function List({ list, getList }) {
  console.log('list render');
  const { token } = useAuth();

  const handleDeleteCompleted = (e) => {
    list.filter( async (item) => {
      if(item.completed_at) {
        e.preventDefault();
        
        await fetch(`https://todoo.5xcamp.us/todos/${item.id}`, {
          method: 'DELETE',
          headers: new Headers({
            'Content-Type': 'application/json',
            'authorization': token || user?.auth,
          })
        })
          .then(res => res.json())
          .then(() => getList())
          .catch(err => console.log(err.toString()));
        
        MySwal.fire({
          position: 'center',
          icon: 'success',
          title: '刪除成功',
          showConfirmButton: false,
          timer: 1250
        })  
      }
    })
  }

  return (
    <div className="todoList_list">
      <ul className="todoList_tab">
              <li>
                <a href="#" className="active">
                  全部
                </a>
              </li>
              <li>
                <a href="#">待完成</a>
              </li>
              <li>
                <a href="#">已完成</a>
              </li>
            </ul>
            <div className="todoList_items">
      <ul className="todoList_item">
        {
          list.map( item => <Item key={item.id} item={item} getList={getList}/>)
        }
      </ul>
      <div className="todoList_statistics">
        <p>{list.filter(item => !item.completed_at).length} 個待完成項目</p>
        <a href="#" onClick={e => handleDeleteCompleted(e)}>清除已完成項目</a>
      </div>
    </div>
    </div> 
  )
}

export default List;