import { gqlV2 } from '../../../lib/graphql/helpers';
import { CommentFieldsFragment } from '../../conversations/graphql';

export const loggedInAccountExpensePayoutFieldsFragment = gqlV2`
  fragment loggedInAccountExpensePayoutFieldsFragment on Individual {
    id
    slug
    imageUrl
    type
    name
    location {
      address
      country
    }
    payoutMethods {
      id
      type
      name
      data
    }
    adminMemberships: memberOf(role: ADMIN, includeIncognito: false, accountType: [ORGANIZATION], isHostAccount: false) {
      nodes {
        id
        account {
          id
          slug
          imageUrl
          type
          name
          location {
            address
            country
          }
          payoutMethods {
            id
            type
            name
            data
          }
        }
      }
    }
  }
`;

const HostFieldsFragment = gqlV2`
  fragment HostFieldsFragment on Host {
    id
    name
    slug
    type
    expensePolicy
    website
    location {
      address
      country
    }
    plan {
      transferwisePayouts
      transferwisePayoutsLimit
    }
    transferwise {
      availableCurrencies
    }
  }
`;

export const expensePageExpenseFieldsFragment = gqlV2`
  fragment expensePageExpenseFieldsFragment on Expense {
    id
    legacyId
    description
    currency
    type
    status
    privateMessage
    tags
    amount
    createdAt
    items {
      id
      incurredAt
      description
      amount
      url
    }
    attachedFiles {
      id
      url
    }
    payee {
      id
      slug
      name
      type
      location {
        address
        country
      }
      payoutMethods {
        id
        type
        name
        data
      }
    }
    createdByAccount {
      id
      slug
      name
      type
      imageUrl
    }
    account {
      id
      slug
      name
      type
      imageUrl
      description
      settings
      twitterHandle
      currency
      expensePolicy
      ... on Collective {
        id
        isApproved
        balance
        host {
          ...HostFieldsFragment
        }
      }
      ... on Event {
        id
        isApproved
        balance
        host {
          ...HostFieldsFragment
        }
        parentCollective {
          id
          slug
          name
          type
          imageUrl
        }
      }
    }
    payoutMethod {
      id
      type
      data
    }
    comments {
      nodes {
        ...CommentFields
      }
    }
    permissions {
      canEdit
      canDelete
      canSeeInvoiceInfo
      canApprove
      canUnapprove
      canReject
      canPay
      canMarkAsUnpaid
    }
    activities {
      id
      type
      createdAt
      individual {
        id
        type
        slug
        name
        imageUrl
      }
    }
  }

  ${CommentFieldsFragment}
  ${HostFieldsFragment}
`;
