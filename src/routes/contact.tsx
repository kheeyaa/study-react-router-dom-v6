import {Form, LoaderFunctionArgs, useLoaderData, useFetcher} from 'react-router-dom'
import {ContactType, getContact, updateContact} from '../contacts'

export async function action({request, params}: any) {
  let formData = await request.formData()
  return updateContact(params.contactId, {
    favorite: formData.get('favorite') === 'true',
  })
}

// 연락처를 불러옴, useLoaderData()를 통해 불러온 데이터를 사용함
export async function loader({params}: LoaderFunctionArgs) {
  const contact = await getContact(params.contactId)
  // 연락처가 없으면 404를 띄움
  if (!contact) {
    throw new Response('404 에러입니다.', {
      status: 404,
      statusText: 'Not Found',
    })
  }
  return {contact}
}

export default function Contact() {
  const {contact} = useLoaderData() as {contact: ContactType}

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar} />
      </div>

      <button
        type="button"
        onClick={() => {
          // loader나 action을 사용하지 않으면 아래 처럼 에러 페이지로 리다이렉트를 직접 해줘야함
          // 그러면 네비게이션바가 없는 에러 페이지로 이동하니까 에러 핸들링을 상세하게 할 수 없음
          location.href = `http://${location.host}/error`
        }}
      >
        에러 발생기
      </button>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault()
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  )
}

function Favorite({contact}: {contact: ContactType}) {
  const fetcher = useFetcher()

  let favorite = contact.favorite
  // Optimistic UI
  if (fetcher.formData) {
    favorite = fetcher.formData.get('favorite') === 'true'
  }

  return (
    <fetcher.Form method="post">
      <button name="favorite" value={favorite ? 'false' : 'true'} aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}>
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  )
}
