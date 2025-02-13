/* eslint-disable no-shadow */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useAuth0 } from "@auth0/auth0-react";
import { Redirect } from 'react-router-dom';
import { deleteUser, getAdminUsersData, getUserData } from '../../../../Redux/Actions/index';
import TablePage from '../../TablePage/TablePage';
import Paginacion from '../../../Paginacion/Paginacion';

function PostsAdmin({
  userInfo, panelAdmin, getUserData, getAdminData, deleteUser,
}) {
  const {user} = useAuth0();
  let userId;
  if (user.sub.includes('google')){
    userId = user.sub.slice(14)
  } else {
    userId = user.sub.slice(6)
  }

  useEffect(() => {
    getUserData(userId)
    getAdminData(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isAdmin = userInfo.type === 'Admin' || userInfo.type === 'SuperAdmin';
  const {
    render, count, currentPage,
  } = panelAdmin;
  const { users } = render;
  const list = () => {
    const data = [];
    users?.forEach((e) => {
      data.push({
        column1: e.email,
        displayLink: true,
        link: e.userId,
        column2: e.name,
        column3: e.phone,
        id: e.id,
      });
    });
    return data;
  };
  async function deleteAndGet(id, userId) {
    await deleteUser(id)
    await getAdminData(userId)
  }
  return (
    <div>
      {isAdmin &&
        <>
          <TablePage
            tableName="users"
            columns={['E-mail', 'User name', 'Phone']}
            data={list()}
            path="user"
            buttonPath="user"
            deleteAction={deleteAndGet}
          />
          {/* <Paginacion /> */}
          {
            count && (
              <Paginacion
                count={count}
                paginaActual={currentPage}
                limit={10}
                path="/panel/admin/users"
                functionNext={() => getAdminData(userId)}
              />
            )
          }
        </>
      }
      {!isAdmin && <Redirect to="/home" />}
    </div>
  );
}
const mapStateToProps = (state) => ({
  panelAdmin: state.panelAdmin,
  userInfo: state.panelUser.render,
});

const mapDispatchToProps = (dispatch) => ({
  deleteUser: () => dispatch(deleteUser()),
  getAdminData: (adminId) => dispatch(getAdminUsersData(adminId)),
  getUserData: (id) => dispatch(getUserData(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostsAdmin);
