import React, { useEffect, useState } from 'react'
import * as yup from 'yup'


const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const leSchema = yup.object().shape({
  fullName: yup.string().trim()
    .min(3, validationErrors.fullNameTooShort).max(20, validationErrors.fullNameTooLong),

  size: yup.string().trim()
    .oneOf(['small', 'medium', 'large'], validationErrors.sizeIncorrect)
})

const toppings = [
  { topping_id: '1', text: 'Pepperoni', value: false},
  { topping_id: '2', text: 'Green Peppers', value: false},
  { topping_id: '3', text: 'Pineapple', value: false},
  { topping_id: '4', text: 'Mushrooms', value: false},
  { topping_id: '5', text: 'Ham', value: false},
]

const initialValues = () => ({
  fullName: '',
  size: '',
  toppings: []
})
const initialErrors = () => ({
  fullName: '',
  size: ''
})

let toppingsArr = []
let successText;

export default function Form() {
  const [values, setValues] = useState(initialValues())
  const [errors, setErrors] = useState(initialErrors())
  const [enabled, setEnabled] = useState(false)
  const [formSuccess, setFormSuccess] = useState()
  const [formFailure, setFormFailure] = useState()
  
  useEffect(() => {
    leSchema.isValid(values).then(setEnabled)
  }, [values])

  const updateToppings = (topping_id) => {
    if(!toppingsArr.includes(topping_id)){
    toppingsArr.push(topping_id)
    } else if (toppingsArr.includes(topping_id)) {
      toppingsArr.splice(toppingsArr.indexOf(topping_id), 1)
    }
    setValues({ ...values, toppings: toppingsArr})
  }

  const onChange = evt => {
    let { name, value, type, checked } = evt.target
    if (type == 'checkbox') {
      console.log(checked)
      updateToppings(name)
    } else {
      setValues({ ...values, [name]: value })
      yup
      .reach(leSchema, name)
      .validate(value)
      .then(() => {
        setErrors({ ...errors, [name]: "" })
      })
      .catch((err) => {
        setErrors({ ...errors, [name]: err.errors[0] })
      })
    }
  }

  const onSubmit = evt => {
    let toppingsStr = ''
    if (toppingsArr.length > 1) {
      toppingsStr = toppingsArr.length + ' toppings' 
    } else if (toppingsArr.length == 1) {
      toppingsStr = toppingsArr.length + ' topping'
    } else if (toppingsArr.length < 1) {
      toppingsStr = ' no toppings'
    }

    successText = `Thank you for your order, ${values.fullName}! Your ${values.size} pizza with ` + toppingsStr + ` is on the way.`

    evt.preventDefault()
    setFormSuccess(true)
    setFormFailure(false)
    toppingsArr = []
    setValues(initialValues())
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {formSuccess && <div className='success'>{successText}</div>}
      {formFailure && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={values.fullName} placeholder="Type full name" id="fullName" name="fullName" type="text" onChange={onChange} />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select value={values.size} id="size" name="size" onChange={onChange}>
            <option value="">----Choose Size----</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map((item) => {
          return (
            <label key={item.topping_id}>
              <input
                checked={toppingsArr.includes(item.topping_id)}
                name={item.topping_id}
                type="checkbox"
                onChange={onChange}
              />
              {item.text}
              <br />
            </label>
          )
        })}
      </div>
      <input disabled={!enabled} type="submit" />
    </form>
  )
}
