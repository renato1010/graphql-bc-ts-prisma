import ApolloBoost, { gql } from 'apollo-boost';

const client = new ApolloBoost({
  uri: 'http://localhost:4000',
});

const getUsers = gql`
  query {
    users {
      id
      name
    }
  }
`;

client
  .query({
    query: getUsers,
  })
  .then(({ data }) => {
    console.log({ data });
    let html = '';
    data.users.forEach((user) => {
      html += `
        <div>
          <h3>${user.name}</h3>
        </div>
      `;
    });
    document.getElementById('users').innerHTML = html;
  });
