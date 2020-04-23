import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Paypal as PaypalIcon } from '@styled-icons/fa-brands/Paypal';
import { University as OtherIcon } from '@styled-icons/fa-solid/University';
import { PayoutMethodType } from '../../lib/constants/payout-method';
import StyledButton from '../StyledButton';
import { Span, H4, P } from '../Text';
import Link from '../Link';
import StyledTooltip from '../StyledTooltip';
import TransferwiseIcon from '../icons/TransferwiseIcon';
import StyledModal, { ModalHeader, ModalBody } from '../StyledModal';
import StyledInputField from '../StyledInputField';
import StyledSelect from '../StyledSelect';
import StyledInputAmount from '../StyledInputAmount';
import i18nPayoutMethodType from '../../lib/i18n-payout-method-type';
import Container from '../Container';
import FormattedMoneyAmount from '../FormattedMoneyAmount';
import { Flex } from '../Grid';
import { CurrencyPrecision } from '../../lib/constants/currency-precision';

const getDisabledMessage = (expense, collective, payoutMethod) => {
  const host = collective.host;
  if (!host) {
    return <FormattedMessage id="expense.pay.error.noHost" defaultMessage="Expenses cannot be payed without a host" />;
  } else if (collective.balance < expense.amount) {
    return <FormattedMessage id="expense.pay.error.insufficientBalance" defaultMessage="Insufficient balance" />;
  } else if (!payoutMethod) {
    return null;
  } else if (payoutMethod.type === PayoutMethodType.BANK_ACCOUNT) {
    const { transferwisePayouts, transferwisePayoutsLimit } = host.plan;
    if (transferwisePayoutsLimit !== null && transferwisePayouts >= transferwisePayoutsLimit) {
      return (
        <FormattedMessage
          id="expense.pay.transferwise.planlimit"
          defaultMessage="You reached your plan's limit, <Link>upgrade your plan</Link> to continue paying expense with TransferWise"
          values={{
            Link(message) {
              return <Link route={`/${host.slug}/edit/host-plan`}>{message}</Link>;
            },
          }}
        />
      );
    }
  }
};

const PayoutMethodTypeIcon = ({ type, ...props }) => {
  switch (type) {
    case PayoutMethodType.PAYPAL:
      return <PaypalIcon {...props} />;
    case PayoutMethodType.BANK_ACCOUNT:
      return <TransferwiseIcon {...props} />;
    default:
      return <OtherIcon {...props} />;
  }
};

PayoutMethodTypeIcon.propTypes = {
  type: PropTypes.oneOf(Object.values(PayoutMethodType)),
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const PayExpenseButton = ({ expense, collective, disabled, onSubmit, ...props }) => {
  const [paymentProcessorFee, setPaymentProcessorFee] = React.useState(null);
  const [hasModal, showModal] = React.useState(false);
  const intl = useIntl();
  const disabledMessage = getDisabledMessage(expense, collective, expense.payoutMethod);
  const isDisabled = Boolean(disabled || disabledMessage);
  const payoutMethodType = expense.payoutMethod?.type || PayoutMethodType.OTHER;
  const payoutMethodTypeLabel = i18nPayoutMethodType(intl.formatMessage, payoutMethodType, {
    aliasBankAccountToTransferWise: true,
  });

  const getSubmitHandler = (isManual = false) => () => {
    return onSubmit({ paymentProcessorFee, isManual });
  };

  const button = (
    <StyledButton buttonStyle="successSecondary" {...props} disabled={isDisabled} onClick={() => showModal(true)}>
      <PayoutMethodTypeIcon type={expense.payoutMethod?.type} size={12} />
      <Span ml="6px">
        <FormattedMessage id="actions.pay" defaultMessage="Pay" />
      </Span>
    </StyledButton>
  );

  if (disabledMessage) {
    return <StyledTooltip content={disabledMessage}>{button}</StyledTooltip>;
  } else if (hasModal) {
    return (
      <React.Fragment>
        {button}
        <StyledModal show onClose={() => showModal(false)} width="100%" minWidth={280} maxWidth={334}>
          <ModalHeader />
          <ModalBody mb={0}>
            <H4 fontSize="20px" fontWeight="bold" mb={3}>
              <FormattedMessage id="Expense.PayoutAndFees" defaultMessage="Payout method and fees" />
            </H4>
            <P fontSize="13px" lineHeight="19px" mb={3}>
              <FormattedMessage
                id="Expense.PayoutAndFeesDetails"
                defaultMessage="Please add the corresponding fees according to the payout option selected."
              />
            </P>
            <StyledInputField
              htmlFor="payExpenseModalPayoutMethod"
              label={<FormattedMessage id="ExpenseForm.PayoutOptionLabel" defaultMessage="Payout method" />}
            >
              {({ id }) => <StyledSelect id={id} disabled value={{ label: payoutMethodTypeLabel }} />}
            </StyledInputField>
            <StyledInputField
              htmlFor="payExpenseModalPayoutMethod"
              inputType="number"
              label={<FormattedMessage id="PayExpense.FeesInput" defaultMessage="Fees (if apply)" />}
              mt={24}
            >
              {inputProps => (
                <StyledInputAmount
                  {...inputProps}
                  currency={collective.currency}
                  value={paymentProcessorFee}
                  onChange={e => setPaymentProcessorFee(e.target.value)}
                  min="0"
                  placeholder="0.00"
                  parseNumbers
                />
              )}
            </StyledInputField>
            <Container mt={24} mb={16} py={3} borderTop="1px solid #DCDEE0" borderBottom="1px solid #DCDEE0">
              <FormattedMessage
                id="TotalAmountWithFees"
                defaultMessage="Total amount with fees: {amount}"
                values={{
                  amount: (
                    <FormattedMoneyAmount
                      amount={expense.amount + paymentProcessorFee}
                      currency={collective.currency}
                      precision={CurrencyPrecision.DEFAULT}
                    />
                  ),
                }}
              >
                {(label, amount) => (
                  <Flex justifyContent="space-between" alignItems="center">
                    <Span fontSize="12px" ml={3}>
                      {label}
                    </Span>
                    <Span fontSize="16px">{amount}</Span>
                  </Flex>
                )}
              </FormattedMessage>
            </Container>
            <Flex flexWrap="wrap" justifyContent="space-evenly">
              {payoutMethodType === PayoutMethodType.OTHER ? (
                <StyledButton buttonStyle="success" minWidth={100} m={1} onClick={getSubmitHandler()}>
                  <FormattedMessage id="actions.pay" defaultMessage="Pay" />
                </StyledButton>
              ) : (
                <React.Fragment>
                  <StyledButton buttonStyle="success" minWidth={100} m={1} onClick={getSubmitHandler()}>
                    <FormattedMessage
                      id="expense.pay.btn"
                      defaultMessage="Pay with {paymentMethod}"
                      values={{ paymentMethod: payoutMethodTypeLabel }}
                    />
                  </StyledButton>
                  <StyledButton buttonStyle="success" minWidth={100} m={1} onClick={getSubmitHandler(true)}>
                    <FormattedMessage id="expense.markAsPaid" defaultMessage="Mark as paid" />
                  </StyledButton>
                </React.Fragment>
              )}
            </Flex>
          </ModalBody>
        </StyledModal>
      </React.Fragment>
    );
  } else {
    return button;
  }
};

PayExpenseButton.propTypes = {
  expense: PropTypes.shape({
    id: PropTypes.string,
    legacyId: PropTypes.number,
    amount: PropTypes.number,
    payoutMethod: PropTypes.shape({
      type: PropTypes.oneOf(Object.values(PayoutMethodType)),
    }),
  }).isRequired,
  collective: PropTypes.shape({
    balance: PropTypes.number,
    currency: PropTypes.string,
    host: PropTypes.shape({
      plan: PropTypes.object,
    }),
  }).isRequired,
  /** To disable the button */
  disabled: PropTypes.bool,
  /** Function called when users click on one of the "Pay" buttons */
  onSubmit: PropTypes.func.isRequired,
};

export default PayExpenseButton;
