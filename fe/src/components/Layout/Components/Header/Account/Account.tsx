import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { Dropdown, Menu, Button, Flex } from 'antd'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  // Menu items cho dropdown
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <a  onClick={() => disconnect()} className="disconnect-button">Disconnect</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} trigger={['hover']}>
      <div className="account-container">
        {/* Avatar hình tròn hoặc avatar random */}
      
        {/* Địa chỉ ví tóm tắt */}
        <Button className="account-info">
          <Flex>
         <div> 
         {ensAvatar && <img 
         alt="ENS Avatar" 
         src={ensAvatar || ''}
          />}
         </div>
          <div>
          {ensName ? `${ensName} (${address?.slice(0, 6)}...${address?.slice(-4)})` : address?.slice(0, 6) + '...' + address?.slice(-4)}
          </div>
          </Flex>  
        </Button>
      </div>
    </Dropdown>
  )
}
