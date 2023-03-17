import {Form, useLoaderData, redirect, useNavigate} from 'react-router-dom'
import {ContactType, updateContact} from '../contacts'

export async function action({request, params}: any) {
  const formData = await request.formData()
  const updates = Object.fromEntries(formData) as ContactType
  //   updates.first // "Some"
  //   updates.last // "Name"

  // 업데이트 하고 나서, 해당 컨텍트 페이지로 리다이렉트
  await updateContact(params.contactId, updates)
  return redirect(`/contacts/${params.contactId}`)
}

export default function EditContact() {
  const {contact} = useLoaderData() as {contact: ContactType}
  const navigate = useNavigate()

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input placeholder="First" aria-label="First name" type="text" name="first" defaultValue={contact.first} />
        <input placeholder="Last" aria-label="Last name" type="text" name="last" defaultValue={contact.last} />
      </p>
      <label>
        <span>Twitter</span>
        <input type="text" name="twitter" placeholder="@jack" defaultValue={contact.twitter} />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button
          onClick={() => {
            // 뒤로가기
            navigate(-1)
          }}
          type="button"
        >
          Cancel
        </button>
      </p>
    </Form>
  )
}
