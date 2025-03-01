import React, { useEffect, useState }  from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilLockLocked,
  cilLockUnlocked,
} from '@coreui/icons'
import avatarPlaceholder from 'src/assets/images/avartar.png'
import { toast } from 'react-toastify'

function User() {
  const [users, setUsers] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [onlineTime, setOnlineTime] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/info/users`);
       
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const users = await response.json();

        // Fetch online time for each user and merge it into user data
        const usersWithOnlineTime = await Promise.all(
          users.map(async (user) => {
            try {
              const onlineTimeResponse = await fetch(
                `${import.meta.env.VITE_SERVER_BASE_URL}/user/online-time/${user._id}`
              );

              if (!onlineTimeResponse.ok) {
                throw new Error('Failed to fetch online time');
              }

              const onlineTimeData = await onlineTimeResponse.json();

              return {
                ...user,
                onlineTime: onlineTimeData.totalOnlineTime, // Add total online time in seconds
                timeAgo: timeAgo(user.lastLogin), // Human-readable last login time
              };
            } catch (error) {
              console.error(`Error fetching online time for user ${user._id}:`, error);
              return {
                ...user,
                onlineTime: 0, // Default to 0 if the fetch fails
                timeAgo: timeAgo(user.lastLogin),
              };
            }
          })
        );

        setUsers(usersWithOnlineTime);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);



  const timeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const toggleModal = (user) => {
    setSelectedUser(user)
    setModalVisible(!modalVisible)
  }

  const handleLockUnlock = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/info/users/${selectedUser._id}/lock`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ locked: !selectedUser.locked }),
        })

        if (!response.ok) {
          throw new Error('Failed to update user status')
        }

        const updatedUser = await response.json()

        // Update the user list with the updated user data
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          )
        )

        toast.success(
          `${updatedUser.username} has been ${updatedUser.locked ? 'locked' : 'unlocked'}`
        )
      } catch (error) {
        toast.error('Error updating user status')
        console.error('Error:', error)
      }
    }
    setModalVisible(false)
  }
  

  return (
    <div className='user-container'>
        <CRow>
            <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                    <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                        <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                    {/* <CTableHeaderCell className="bg-body-tertiary text-center">
                        Country
                    </CTableHeaderCell> */}
                    <CTableHeaderCell className="bg-body-tertiary">Online time</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                        Lock/Unlock
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {users.map((user, index) => (
                    <CTableRow v-for="item in tableItems" key={user._id}>
                        <CTableDataCell className="text-center">
                        <CAvatar
                          size="md"
                          src={avatarPlaceholder}
                          status= 'success'
                        />
                        </CTableDataCell>
                        <CTableDataCell>
                        <div>{user.username}</div>
                        <div className="small text-body-secondary text-nowrap">
                            <span> New </span>                  
                        </div>
                        </CTableDataCell>
                        {/* <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                        </CTableDataCell> */}
                        <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap mt-3">
                            {/* <div className="fw-semibold">100%</div>
                            <div className="ms-3">
                            <small className="text-body-secondary">10</small>
                            </div> */}
                             <p>
                              {Math.floor(user.onlineTime / 3600)}h{' '}
                              {Math.floor((user.onlineTime % 3600) / 60)}m{' '}
                              {Math.floor(user.onlineTime % 60)}s
                            </p>
                        </div>
                        {/* <CProgress thin color='red' value = {50} /> */}
                        </CTableDataCell>
                        {/* <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.payment.icon} />
                        </CTableDataCell> */}
                        <CTableDataCell className="text-center">
                        <CButton
                          color="link"
                          onClick={() => toggleModal(user)}
                          title={user.locked ? 'Unlock User' : 'Lock User'}
                        >
                        <CIcon icon={user.locked ? cilLockLocked : cilLockUnlocked} size="xl" />
                        </CButton>
                        </CTableDataCell>
                        <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Last login</div>
                        <div className="fw-semibold text-nowrap">{user.timeAgo}</div>
                        </CTableDataCell>
                    </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
                              
        </CRow>
         {/* Lock/Unlock Confirmation Modal */}
        {selectedUser && (
          <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
            <CModalHeader>
              <CModalTitle>{selectedUser.locked ? 'Unlock User' : 'Lock User'}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              Are you sure you want to {selectedUser.locked ? 'unlock' : 'lock'}{' '}
              <strong>{selectedUser.username}</strong>?
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setModalVisible(false)}>
                Cancel
              </CButton>
              <CButton color="primary" onClick={handleLockUnlock}>
                Confirm
              </CButton>
            </CModalFooter>
          </CModal>
      )}
    </div>
  )
}

export default User;
