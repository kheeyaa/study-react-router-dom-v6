import {useEffect} from 'react'
import {Form, NavLink, Outlet, redirect, useLoaderData, useNavigation, useSubmit} from 'react-router-dom'

import {Contacts, getContacts, createContact} from '../contacts'

// New 버튼을 누르면 Form에서 post 요청이 발생하여 이 함수를 호출함. 따라서 새로운 연락처를 생성하고, 해당 연락처의 수정 페이지로 리다이렉트
export async function action(props: any) {
  console.log('root action', props)
  const contact = await createContact()
  return redirect(`/contacts/${contact.id}/edit`)
}

// 연락처 목록을 불러옴. New 버튼을 누르면 새로운 연락처가 생성되므로, 이 함수를 호출함
// useLoaderData()를 통해 불러온 데이터를 사용함
export async function loader({request}: any): Promise<{
  contacts: Contacts
  검색어: string | null
}> {
  const url = new URL(request.url)
  const 검색어 = url.searchParams.get('검색어')
  const contacts = await getContacts(검색어)
  return {contacts, 검색어}
}

export default function Root() {
  const {contacts, 검색어} = useLoaderData() as {contacts: Contacts; 검색어: string | null}
  const navigation = useNavigation()
  const submit = useSubmit()

  // The navigation.location will show up when the app is navigating to a new URL and loading the data for it.
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('검색어')

  // url이 변경되어 검색어가 변경되면, 검색어 input의 value를 변경함
  useEffect(() => {
    const input = document.getElementById('검색어') as HTMLInputElement
    if (!input) return
    input.value = 검색어 || ''
  }, [검색어])

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="검색어"
              className={searching ? 'loading' : ''}
              aria-label="Search contacts"
              placeholder="Search"
              // search type의 input은 검색어를 입력하면 url에 검색어가 포함됨
              type="search"
              name="검색어"
              defaultValue={검색어 || undefined}
              onChange={(event) => {
                // isFirstSearch: 검색어 히스토리가 너무 많이쌓이는거 방지하기 위한 로직
                const isFirstSearch = 검색어 == null
                console.log({isFirstSearch})
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                })
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            {/* submit type의 버튼은 클릭하면 action을 호출함 */}
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({isActive, isPending}) => (isActive ? 'active' : isPending ? 'pending' : '')}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail" className={navigation.state === 'loading' ? 'loading' : ''}>
        <Outlet />
      </div>
    </>
  )
}
