import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { FormattedMessage } from 'react-intl';
import { Check as ApproveIcon } from '@styled-icons/fa-solid/Check';
import { Times as RejectIcon } from '@styled-icons/fa-solid/Times';
import { Ban as UnapproveIcon } from '@styled-icons/fa-solid/Ban';
import { API_V2_CONTEXT, gqlV2 } from '../../lib/graphql/helpers';
import { expensePageExpenseFieldsFragment } from './graphql/fragments';
import StyledButton from '../StyledButton';
import styled from 'styled-components';
import MessageBox from '../MessageBox';
import { getErrorFromGraphqlException } from '../../lib/errors';
import PayExpenseButton from './PayExpenseButton';

const PROCESS_EXPENSE_MUTATION = gqlV2`
  mutation processExpense($id: String, $legacyId: Int, $action: ExpenseProcessAction!, $paymentParams: ProcessExpensePaymentParams) {
    processExpense(expense: {id: $id, legacyId: $legacyId}, action: $action, paymentParams: $paymentParams) {
      ...expensePageExpenseFieldsFragment
    }
  }

  ${expensePageExpenseFieldsFragment}
`;

const ButtonLabel = styled.span({ marginLeft: 6 });

/**
 * A small helper to know if expense process buttons should be displayed
 */
export const hasProcessButtons = permissions => {
  if (!permissions) {
    return false;
  }

  return (
    permissions.canApprove ||
    permissions.canReject ||
    permissions.canPay ||
    permissions.canPay ||
    permissions.canMarkAsUnpaid
  );
};

/**
 * All the buttons to process an expense, displayed in a React.Fragment to let the parent
 * in charge of the layout.
 */
const ProcessExpenseButtons = ({ expense, collective, permissions, buttonProps }) => {
  const [selectedAction, setSelectedAction] = React.useState(null);
  const mutationOptions = { context: API_V2_CONTEXT, variables: { id: expense.id, legacyId: expense.legacyId } };
  const [processExpense, { loading, error }] = useMutation(PROCESS_EXPENSE_MUTATION, mutationOptions);

  const triggerAction = (action, paymentParams) => {
    setSelectedAction(action);
    return processExpense({ variables: { action, paymentParams } });
  };

  const getButtonProps = (action, hasOnClick = true) => {
    const isSelectedAction = selectedAction === action;
    return {
      ...buttonProps,
      disabled: loading && !isSelectedAction,
      loading: loading && isSelectedAction,
      onClick: hasOnClick ? () => triggerAction(action) : undefined,
    };
  };

  return (
    <React.Fragment>
      {!loading && error && (
        <MessageBox flex="1 0" width="100%" type="error" withIcon>
          {getErrorFromGraphqlException(error).message}
        </MessageBox>
      )}
      {permissions.canApprove && (
        <StyledButton {...getButtonProps('APPROVE')} buttonStyle="secondary">
          <ApproveIcon size={12} />
          <ButtonLabel>
            <FormattedMessage id="actions.approve" defaultMessage="Approve" />
          </ButtonLabel>
        </StyledButton>
      )}
      {permissions.canReject && (
        <StyledButton {...getButtonProps('REJECT')} buttonStyle="dangerSecondary">
          <RejectIcon size={14} />
          <ButtonLabel>
            <FormattedMessage id="actions.reject" defaultMessage="Reject" />
          </ButtonLabel>
        </StyledButton>
      )}
      {permissions.canPay && (
        <PayExpenseButton
          {...getButtonProps('PAY', false)}
          onSubmit={paymentParams => triggerAction('PAY', paymentParams)}
          expense={expense}
          collective={collective}
        />
      )}
      {permissions.canUnapprove && (
        <StyledButton {...getButtonProps('UNAPPROVE')} buttonStyle="dangerSecondary">
          <UnapproveIcon size={12} />
          <ButtonLabel>
            <FormattedMessage id="expense.unapprove.btn" defaultMessage="Unapprove" />
          </ButtonLabel>
        </StyledButton>
      )}
      {permissions.canMarkAsUnpaid && (
        <StyledButton {...getButtonProps('MARK_AS_UNPAID')} buttonStyle="dangerSecondary">
          <FormattedMessage id="expense.markAsUnpaid.btn" defaultMessage="Mark as unpaid" />
        </StyledButton>
      )}
    </React.Fragment>
  );
};

ProcessExpenseButtons.propTypes = {
  permissions: PropTypes.shape({
    canApprove: PropTypes.bool,
    canUnapprove: PropTypes.bool,
    canReject: PropTypes.bool,
    canPay: PropTypes.bool,
    canMarkAsUnpaid: PropTypes.bool,
  }).isRequired,
  expense: PropTypes.shape({
    id: PropTypes.string,
    legacyId: PropTypes.number,
  }).isRequired,
  /** The account where the expense has been submitted */
  collective: PropTypes.object.isRequired,
  /** Props passed to all buttons. Usefull to customize sizes, spaces, etc. */
  buttonProps: PropTypes.object,
};

ProcessExpenseButtons.defaultProps = {
  buttonProps: {
    buttonSize: 'small',
    minWidth: 90,
    mx: 2,
    mt: 2,
  },
};

export default ProcessExpenseButtons;
