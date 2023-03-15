import {Form, Link, Outlet, redirect, useLoaderData} from 'react-router-dom'

import {Contacts, getContacts, createContact} from '../contacts'

// New 버튼을 누르면 Form에서 post 요청이 발생하여 이 함수를 호출함. 따라서 새로운 연락처를 생성하고, 해당 연락처의 수정 페이지로 리다이렉트
export async function action() {
  const contact = await createContact()
  return redirect(`/contacts/${contact.id}/edit`)
}

// 연락처 목록을 불러옴. New 버튼을 누르면 새로운 연락처가 생성되므로, 이 함수를 호출함
// useLoaderData()를 통해 불러온 데이터를 사용함
export async function loader(): Promise<{
  contacts: Contacts
}> {
  const contacts = await getContacts()
  return {contacts}
}

export default function Root() {
  const {contacts} = useLoaderData() as {contacts: Contacts}

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input id="q" aria-label="Search contacts" placeholder="Search" type="search" name="q" />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <Link to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite && <span>★</span>}
                  </Link>
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
      <div id="detail">
        <Outlet />
      </div>
    </>
  )
}
